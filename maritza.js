/*

    (c) Aurelian University
    
    JavaScript framework and backend programming language

*/

/*

    Applications Constants

*/

const MarLanguages = new Array();


/*

    Region Object

*/

function Region(start, end, text)
{
    this.getStart = () => start;
    this.getEnd = () => end;
    this.getText = () => text;
    this.setStart = (value) => {
        start = value;
        return start;
    }
    this.setEnd = (value) => {
        end = value;
        return end;
    }
    this.setText = (value) => {
        text = value;
        return text;
    }
}

Region.prototype.getLength = function()
{
    return this.getEnd() - this.getStart();
}

/*

    Quote Regions Object

*/

function QuoteRegions(text)
{
    this.getText = () => text;
    this.setText = (value) => {
        text = value;
        return text;
    }
    this.regions = this.getRegionsFromText();
}

function NodeSet(startRegions, endRegions)
{
    this.getStartRegions = () => startRegions;
    this.getEndRegions = () => endRegions;
    this.setStartRegions = (value) => {
        startRegions = value;
        return startRegions;
    }
    this.setEndRegions = (value) => {
        endRegions = value;
        return endRegions;
    }
}

NodeSet.prototype.getChildrenOfNode = function()
{
    const complete = new Array();
    const children = new Array();
    const startRegions = this.getStartRegions();
    const endRegions = this.getEndRegions();
    for (let i = 0; i < startRegions.length; i++)
    {
        complete.push(startRegions[i]);
    }
    for (let i = 0; i < endRegions.length; i++)
    {
        complete.push(endRegions[i]);
    }
    complete.sort((a,b) => a.getStart() - b.getStart());
    let current = "";
    let closer = "";
    let deficit = 0;
    let txt = ""
    for (let i = 0; i < complete.length; i++)
    {
        txt = complete[i].getText();
        if (current === "" && txt[0] !== "/")
        {
            current = complete[i];
            closer = "/" + txt;
            deficit = 0;
        }
        else
        {
            if (deficit === 0 && txt === closer)
            {
                children.push(new Region(current.getStart(), 
                                  complete[i].getEnd()));
                current = "";
                closer = "";
            }
            if (current.getText && current.getText() === txt)
            {
                deficit += 1;
            }
            if (closer === txt)
            {
                deficit -= 1;
            }
        }
    }
    return children;
}

/*

    Domain Object

*/

function Domain(string, parser)
{
    this.getText = () => string;
    this.getParser = () => parser;
    this.setText = (value) => {
        string = value;
        return string;
    }
    this.setParser = (func) => {
        parser = func;
        return parser;
    }
}

Domain.prototype.createNode =  function(name, properties, content)
{
    let top = "<" + name;
    for (let property in properties)
    {
        top += " " + property + "=\"" + properties[property] + "\" ";
    }
    top += ">";
    return top + content + "</" + name + ">";
}

Domain.prototype.addNode = function(name, properties, content)
{
    return this.setText(
        this.getText() + this.createNode(name, properties, content)
    );
}

Domain.prototype.getNodeSet = function(path)
{
    let isEscaped = false;
    let inSingle = false;
    let inDouble = false;
    let copyStart = false;
    let copyEnd = false;
    let start = "";
    let end = "";
    const startRegions = new Array();
    const endRegions = new Array();
    const text = this.getText();
    for (let i = 0; i < text.length; i++)
    {
        if (text[i] === "'" && !isEscaped)
        {
            if (inSingle)
            {
                inSingle = false;
            }
            else
            {
                inSingle = true;
            }
        }
        if (text[i] === '"' && !isEscaped)
        {
            if (inDouble)
            {
                inDouble = false;
            }
            else
            {
                inDouble = true;
            }
        }
        if (!inSingle && !inDouble && !isEscaped)
        {
            if (text[i] === "<")
            {
                if (text[i + 1] && text[i + 1] === "/")
                {
                    copyEnd = true;
                }
                else
                {
                    copyStart = true;
                }
            }
            else if (text[i] === " " || 
                     text[i] === "\n" || 
                     text[i] === "\r" || 
                     text[i] === ">")
            {
                if (copyStart)
                {
                    startRegions.push(new Region(i - start.length, i, start));
                    start = "";
                    copyStart = false;
                }
                else if (copyEnd)
                {
                    endRegions.push(new Region(i - end.length, i, end));
                    end = "";
                    copyEnd = false;
                }
            }
            else
            {
                if (copyStart)
                {
                    start += text[i];
                }
                else if (copyEnd)
                {
                    end += text[i];
                }
            }
        }
        if (text[i] === "\\")
        {
            isEscaped = !isEscaped;
        }
        else
        {
            isEscaped = false;
        }
    }
    return new NodeSet(startRegions, endRegions);
}

/*

    Parser Result Object

*/

function ParserResult(path, exists)
{
    this.path = path;
    this.exists = exists;
}

/*

    Step Object

*/

function Step(number, name)
{
    this.number = number;
    this.name = name;
}

/*

    Parser Factory Object

*/

function ParserFactory(del, numDir, termDir)
{
    this.delimiter = del;
    this.numberDirection = numDir;
    this.termDirection = termDir;
}

ParserFactory.prototype.getParserResult = function(path)
{
    const steps = path.trim().split(this.delimiter);
    let sub, number, name;
    for (let i = 0; i < steps.length; i++)
    {
        sub = steps[i].trim().split(/\s/g);
        if (this.numberDirection === -1)
        {
            if (sub.length > 1)
            {
                number = sub[0];
                name = sub[1];
            }
            else
            {
                number = "nihil";
                name = sub[0];
            }
        }
        else
        {
            if (sub.length > 1)
            {
                number = sub[1];
                name = sub[0];
            }
            else
            {
                number = "nihil";
                name = sub[0];
            }
        }
        steps[i] = new Step(number, name);
    }
    if (this.termDir === -1)
    {
        steps = steps.reverse();
    }
    return steps;
}

/*

    Commands object

*/

function Command(name, language, match, extract, action) 
{
    this.name = name;
    this.language = language;
    this.matches = match;
    this.extract = extract;
    this.action = action;
}

Command.prototype.apply = function(text, application)
{
    if (this.matches(text))
    {
        this.action(this.extract(text), application);
        return true;
    }
    return false;
}

/*

    Language Object

*/

function Language(name, commands)
{
    this.name = name;
    this.commands = commands;
    this.default = () => true;
}

Language.prototype.addCommand = function(command)
{
    this.commands.push(command);
    return true;
}

Language.prototype.removeCommand = function(name)
{
    for (let i = 0; i < this.commands.length; i++)
    {
        if (this.commands[i].name === name)
        {
            this.commands.splice(i, 1);
            return true;
        }
    }
    return false;
}

Language.prototype.getCommand = function(name)
{
    for (let i = 0; i < this.commands.length; i++)
    {
        if (this.commands[i].name == name)
        {
            return this.commands[i];
        }
    }
    return false;
}

/*

    Interpreter Object

*/

function Interpreter(languages)
{
    this.languages = languages || [];
}

Interpreter.prototype.addLanguage = function(language)
{
    this.languages.push(language);
    return true;
}

Interpreter.prototype.getLanguage = function(name)
{
    for (let i = 0; i < this.languages.length; i++)
    {
        if (this.languages[i].name === name)
        {
            return this.languages[i];
        }
    }
    return false;
}

/*

    Application Object

*/

function Application(interpreter, txt, parser) 
{
    interpreter = interpreter || new Interpreter();
    let text = txt || "";
    let del = "\n";
    let lines = [];
    let locus = 0;
    let language = "anglica";
    let self = this;
    this.information = {};
    this.parser = parser;
    this.id = "Application" + ~~(Math.random()*1000000);
    this.getLanguage = () => language;
    this.getText = () => text;
    this.getDelimiter = () => del;
    this.setDelimiter = (d) => { del = d; return 1; };
    this.getLines = () => lines;
    this.setLines = (l) => lines = l;
    this.getInterpreter = () => interpreter;
    this.setInterpreter = (i) => { interpreter = i; return 1; };
}

Application.prototype.run = function()
{
    this.setLines(this.getText().split(this.getDelimiter()));
    let lines = this.getLines();
    for (let i = 0; i < lines.length; i++)
    {
        this.evaluate(lines[i]);
    }
    return true;
}

Application.prototype.evaluate = function(line)
{
    console.log(line);
    const interpreter = this.getInterpreter();
    const commands = interpreter.getLanguage(this.getLanguage()).commands;
    for (let i = 0; i < commands.length; i++)
    {
        if (commands[i].apply(line, this))
        {
            return true;
        }
    }
    return false;
}
