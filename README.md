# MCU pin setup

Generic visual pin layout setup tool for development boards, including a setup-based automatic code generator.

Webpage link: https://hubberthus.github.io/

# Description

If you are familiar with development boards widely available, like an Arduino, you most likely looked at the pin-out image for it, because they have different layouts.

MCU pin setup is an online visual WYSIWYG online tool, which allows you to setup the pin layout by clicking, see information, instant feedback of warnings or errors.

Then at the end you are provided with 2 things helping your project:
- Actual pin layout on screen: Allowing easy hardware setup
- Generated code: Providing an easy-to-use interface for the peripherals

What you get:
- Easy and quick boost for new projects, quick changes for existing ones, and with cross-board compatibility, quick change to custom hardware.
- Helps with education of embedded design and development.

The tool itself is an online website, mainly written in HTML and JavaScript, and uses JSON to store MCU core and module information.

Used JavaScript libraries are:
- [jQuery](https://jquery.com/) - If you know JavaScript, this is not new. Feature-rich basic library
- [RequireJS](http://requirejs.org/) - JavaScript code structuring and dynamic loading
- [AngularJS](https://angularjs.org/) - Easy dynamic HTML page updating and data handling
- [Bootstrap](http://getbootstrap.com/) - HTML, CSS and JS framework, handles most of the GUI automatic background work
- [Handlebars](http://handlebarsjs.com/) - Template library used for code generation
- [JSZip](https://stuk.github.io/jszip/) - Allows the user to get the whole generated code in a single zip
- [FileSaver](https://github.com/eligrey/FileSaver.js/) - Allows the user to actually download the file from the page

# Development

The project is maintained by Norbert Fekete. There is a Hackaday.io hosted project page [here](https://hackaday.io/project/20562-mcu-pin-setup).

All development related documentation is stored in the wiki: https://github.com/Hubberthus/hubberthus.github.io/wiki

# Directory structure

- /app/ - JavaScript application code
- /cores/ - Each subdirectory stores information about an MCU core, its peripherals and code templates
- /css/ - Stylesheet files for the site
- /fonts/ - Glyphicon fonts used by Bootstrap
- /lib/ - JavaScript libraries used by the tool
- /modules/ - Each subdirectory stores information about a module

The root directory contains the HTML files, the main JavaScript entry point (config.js), and some miscellaneous files.
