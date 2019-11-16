/*

    Program Object

*/

/*

    Languages

*/

const LanguageList = new Array();
LanguageList.push(AnglicaLanguage);

function Program()
{
    this.applications = [];
    this.elements = document.getElementsByTagName("maritza");
    this.class = document.getElementsByClassName("maritza");
    this.errors = [];
}

Program.prototype.reload = function()
{
    this.elements = document.getElementsByTagName("maritza");
    this.class = document.getElementsByClassName("maritza");
}

Program.prototype.addApplication = function(app)
{
    this.applications.push(app);
    return 1;
}

Program.prototype.createApplications = function()
{
    let language, interpreter, text, parser;
    const MarInterpreter = new Interpreter(LanguageList);
    for (let i = 0; i < this.elements.length; i++)
    {
        try
        {
            language = this.elements[i].dataset.language;
            switch(language)
            {
                case "anglica":
                    parser = AnglicaParser;
                    break;
                case "hispanica":
                    parser = HispanicaParser;
                    break;
                default:
                    parser = AnglicaParser;
                    break;
            }
            text = this.elements[i].innerHTML;
            this.addApplication(new Application(MarInterpreter, text, parser));
        }
        catch(e)
        {
            this.errors.push(e.toString());
            continue;
        }
    }
    for (let i = 0; i < this.class.length; i++)
    {
        try
        {
            language = this.class[i].dataset.language;
            switch(language)
            {
                case "anglica":
                    parser = AnglicaParser;
                    break;
                case "hispanica":
                    parser = HispanicaParser;
                    break;
                default:
                    parser = AnglicaParser;
                    break;
            }
            text = this.class[i].innerHTML;
            this.addApplication(new Application(MarInterpreter, text, parser));
        }
        catch(e)
        {
            this.errors.push(e.toString());
            continue;
        }
    }
    return 1;
}

Program.prototype.run = function()
{
    for (let i = 0; i < this.applications.length; i++)
    {
        const self = this;
        setTimeout(function(){
            console.log(self);
            self.applications[i].run();
        }, 10);
    }
    return 1;
}
