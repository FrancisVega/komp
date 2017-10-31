# Komp

Create files with boilerplate content

### Options

```bash
$komp --help

Usage: newcomp [options]

Options:

  -T, --template <name> File base template
  -v, --verbose         Verbose mode
  -h, --help            output usage information
  -V, --version         output the version number
```

### Install

```bash
npm -g install komp
```

### Config defaults

The scripts creates a configuration file (.komp) and a directory (comp-templates) with template(s) at project root folder (same as package.json) called .komp to set defaults values. If you want to create new templates you have to put inside [root]comp-templates folder. Notice how the base template is created at [root]/comp-templates/base


### Examples of use

```bash
# Create a button component
newcomp button
```

```bash
# Create a myCard component with the component file in the card folder
newcomp myCard --template card
```
