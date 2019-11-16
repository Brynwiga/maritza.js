/*

    Anglica Language

*/

/*

    Commands

*/

const AnglicaCommand1 = new Command(
    "AnglicaCommand1",
    "anglica",
    function(data) {
        const search = /\s*create\s+(.+)\s*/;
        return data.trim().search(search) === 0;
    },
    function(data) {
        const search = /\s*create\s+(.+)\s*/;
        const data1 = search.exec(data)[1];
        return { data1 : data1 };
    },
    function(data, object) {
        object.information[data.data1] = new Domain("", this.parser);
        return 1;
    }
);

const AnglicaCommand2 = new Command(
    "AnglicaCommand2",
    "anglica",
    function(data) {
        const search = /\s*let\s+(\S+)\s+be\s+(\S+)\s*/;
        return data.trim().search(search) === 0;
    },
    function(data) {
        const search = /\s*let\s+(\S+)\s+be\s+(\S+)\s*/;
        data = search.exec(data);
        const data1 = data[1];
        const data2 = data[2];
        return { data1 : data1, data2 : data2 };
    },
    function(data, object) {
        object.information[data.data1] = new Domain(data.data2, this.parser);
        return 1;
    }
);

const AnglicaCommand3 = new Command(
);

const AnglicaCommand4 = new Command(
);

/*

    Put Commands in array

*/

const AnglicaCommands = new Array();
AnglicaCommands.push(AnglicaCommand1);
AnglicaCommands.push(AnglicaCommand2);
// AnglicaCommands.push(MarCommand3);
// AnglicaCommands.push(MarCommand4);

/*

    Anglica Parser

*/

const AnglicaParser = function()
{
    return 1;
}

/*

    Create language object and push it to the global languages array

*/

const AnglicaLanguage = new Language("anglica", AnglicaCommands);

MarLanguages.push(AnglicaLanguage);
