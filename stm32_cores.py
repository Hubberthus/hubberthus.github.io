import xml.etree.ElementTree as ET
import os.path
from os import listdir
import sys
import re
import json
import collections

#cubemx_dir = 'D:\programs\STM32Cube\STM32CubeMX'
cubemx_dir = '/home/dani/private/STM32/'

#if len(sys.argv) == 1:
#    print 'Usage: ' + __file__ + ' STM32_MCU_NAME'
#    print 'For example: ' + __file__ + ' STM32F103C8'
#    exit(-1)

families_xml = os.path.join(cubemx_dir, 'db', 'mcu', 'families.xml')
if not os.path.exists(families_xml):
    print 'Could not find CubeMX, please set CubeMX directory'
    exit(-1)
families = ET.parse(families_xml).getroot()
ns = {'stm': 'http://mcd.rou.st.com/modules.php?name=mcu'}


class load_mcu:
    def __init__(self, name):
        print name
        
        self.mcu_name = name
        
        if families.find(".//Mcu[@RefName='" + self.mcu_name + "Tx']") is not None:
            self.mcu_xml = families.find(".//Mcu[@RefName='" + self.mcu_name + "Tx']").attrib['Name'] + '.xml'
        else:
            self.mcu_xml = families.find(".//Mcu[@RPN='" + self.mcu_name + "']").attrib['Name'] + '.xml'
        
        self.mcu = ET.parse(os.path.join(cubemx_dir, 'db', 'mcu', self.mcu_xml)).getroot()
        self.remap_xml = 'GPIO-' + self.mcu.find("stm:IP[@Name='GPIO']", ns).attrib['Version'] + '_Modes.xml'

        self.remap_root = ET.parse(os.path.join(cubemx_dir, 'db', 'mcu', 'IP', self.remap_xml )).getroot()

        self.mcu_pins = self.mcu.findall('stm:Pin',  ns);

        self.remaps = {}
        self.defaultremaps = {}
        self.af_functions=[]    
        self.pins = []
        self.peripherals = []
        self.signals = {}
        

    def find_remaps(self):
        for pin in self.remap_root.findall('stm:GPIO_Pin',  ns):
            pin_name = pin.attrib['Name']
            
            pin_name = re.search('^(\D*\d*)', pin_name).group(1)
            
            gpio_signals = pin.findall('stm:PinSignal',  ns)
            for gpio_signal in gpio_signals:
                signal = gpio_signal.attrib['Name']
                periph = signal.split('_')[0]
                if signal not in self.remaps:
                    self.remaps[signal] = {}
                
                if self.mcu_name.startswith('STM32F1'):
                    remap_function = False
                    
                    remap_block = gpio_signal.find('stm:RemapBlock', ns)
                    if remap_block is not None:
                        if 'DefaultRemap' in remap_block.attrib:
                            remap_function = 'AF__HAL_AFIO_REMAP_' + periph + '_DISABLE'
                            self.defaultremaps[signal] = pin_name
                        else:
                            remap_function = 'AF' + remap_block.find('stm:SpecificParameter', ns).find('stm:PossibleValue', ns).text
                    else:
                        remap_function = 'AF__NO_REMAP'
                        if signal not in self.defaultremaps:
                            self.defaultremaps[signal] = pin_name
                            
                    self.remaps[signal][pin_name] = remap_function
                    if remap_function not in self.af_functions:
                        self.af_functions.append(remap_function)
                    
                else:
                    gpio_af = gpio_signal.find("stm:SpecificParameter[@Name='GPIO_AF']", ns)
                    self.remaps[signal][pin_name] = gpio_af.find("stm:PossibleValue", ns).text
            
    def process_pins(self):
        for pin in self.mcu_pins:
            pin_name = pin.attrib['Name']
            
            pin_name = re.search('^(\D*\d*)', pin_name).group(1)
            
            self.pins.append(pin_name)
        
            if not pin.attrib['Type'] == 'I/O':
                continue
            
            signals = pin.findall('stm:Signal',  ns)
            for signal_element in signals:
                signal = signal_element.attrib['Name']
                periph = signal.split('_')[0]
                if periph == 'GPIO':
                    continue
                
                if periph not in self.peripherals:
                    self.peripherals.append(periph)
                    
                if signal not in self.defaultremaps:
                    self.defaultremaps[signal] = pin_name

                if signal not in self.remaps:
                    self.remaps[signal] = {}
                    self.remaps[signal][pin_name] = 'AF_NO_REMAP'
                    
                self.signals.setdefault(periph, set()).add(signal.split('_')[1])

def generate_core(mcu):
    mcu_parser = load_mcu(mcu)

    mcu_parser.find_remaps()

    mcu_parser.process_pins()
    
    pin_to_number = {}
    
    pinouts = []
    for pin in mcu_parser.mcu.findall("stm:Pin", ns):
        pinout = {}
        pinout["number"] = pin.attrib['Position']
        pinout["name"] = pin.attrib['Name']
        pinout["description"] = pin.attrib['Type']
        pinouts.append(pinout)
        
        pin_to_number[re.search('^(\D*\d*)', pinout["name"]).group(1)] = int(pinout["number"])
        
    peripherals = []
    for peripheral in sorted(mcu_parser.peripherals):
        periph = {}
        periph["name"] = peripheral
        periph["description"] = ""
        periph["active_mode"] = "OFF"
        periph["pins"] = collections.OrderedDict()
        
        signals = []
        pin_can_be_off = False
        if 'SPI' in peripheral:
            signals = ['MOSI', 'MISO', 'SCK']
            periph["color"] = "green"
        
        if 'I2C' in peripheral:
            signals = ['SDA', 'SCL']
            periph["color"] = "blue"
        
        if 'USART' in peripheral:
            signals = ['RX', 'TX']
            periph["color"] = "brown"
            
        if 'TIM' in peripheral:
            signals = ['CH1', 'CH2', 'CH3', 'CH4']
            pin_can_be_off = True
            periph["color"] = "magenta"
            
        if 'USB' in peripheral:
            signals = ['DP', 'DM']
            periph["active_mode"] = "ON"
            periph["color"] = "lime"
            
        if 'ADC1' in peripheral:
            signals = mcu_parser.signals[peripheral]
            signals = [s for s in signals if s.startswith('IN')]
            signals = sorted(signals)
            pin_can_be_off = True
            periph["color"] = "purple"

        if 'SYS' in peripheral:
            signals = mcu_parser.signals['SYS']
            signals.remove('WKUP')
            periph["active_mode"] = "ON"
            periph["color"] = "red"
            
        if not signals: 
            continue
            
        
        for signal in signals:
            signal_pins = []
            
            default = mcu_parser.defaultremaps[peripheral + "_" + signal]
            signal_pins = [default]
            
            alternate_pins = mcu_parser.remaps[peripheral + "_" + signal].keys()[:]
            alternate_pins.remove(default)
            signal_pins.extend(alternate_pins)
            
            periph["pins"][signal] = []
            
            if pin_can_be_off:
                periph["pins"][signal].append(None)
            for pin in signal_pins:
                if pin in pin_to_number:
                    periph["pins"][signal].append(pin_to_number[pin])
        
        peripherals.append(periph)
        
    with open("cores/" + mcu + "/pinout.json", "w") as f:
        f.write(json.dumps(pinouts, indent=4))
    
    with open("cores/" + mcu + "/peripherals.json", "w") as f:
        f.write(json.dumps(peripherals, indent=4))

    for pin in sorted(pin_to_number):
        print pin, pin_to_number[pin]
    
    #with open(os.path.join('variants', variant, filename + '.c'), 'w') as file:
    #    file.write(header_code)
    #    file.write(source_code)

    #with open(os.path.join('variants', variant, filename + '.h'), 'w') as file:
    #    file.write(header_code)

def ignore():
    official_boards_dir = os.path.join(cubemx_dir, "db", "plugins", "boardmanager", "boards")
    official_boards = os.listdir(official_boards_dir)
    for board in official_boards:
        if 'AllConfig' not in board:
            continue
        
        if 'Evaluation' in board:
            name = board.split('_')[3]
        else:
            name = board.split('_')[2]
            
        mcu = False

        labels = {}
        
        with open(os.path.join(official_boards_dir, board)) as f:
            for line in f.readlines():
                if line.startswith('Mcu.UserName='):
                    mcu = line[line.index('=') + 1:].strip()[0:11]
                if 'GPIO_Label=' in line:
                    pin_name = re.search('^(\D*\d*)', line).group(1)
                    pin_label = line[line.index('=') + 1:].strip()
                    labels[pin_name] = pin_label

        #print name, mcu, labels
        generate_pindefinitions(mcu, 'pindefinition_examples', labels, 'Official ' + name)

    generate_pindefinitions('STM32F103C8', 'pindefinition_examples', {'PC13':'LED'}, 'System Development Blue Board - Blue Pill')
    generate_pindefinitions('STM32F103CB', 'pindefinition_examples', {'PB1':'LED', 'PB8': 'BOOT0/BUTTON', 'PB9': 'USB DISC'}, 'Leaflabs Maple Mini')
    generate_pindefinitions('STM32F103VE', 'pindefinition_examples', {}, 'Vcc-gnd.com STM32F103VE')
    generate_pindefinitions('STM32F103ZE', 'pindefinition_examples', {}, 'Vcc-gnd.com STM32F103ZE')
    generate_pindefinitions('STM32F407VE', 'pindefinition_examples', {}, 'Vcc-gnd.com STM32F407VE')

generate_core('STM32F103CB')
