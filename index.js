class Console {
    constructor(name) {
        this.name = name;
        this.games = [];
    }

    addGame(name, genre) {
        this.games.push(new Game(name, genre));
    }
}

class Game {
    constructor(name, genre) {
        this.name = name;
        this.genre = genre;
    }
}

class ConsoleService {
    static url = "https://crudcrud.com/api/7a4ba723d3ff480fa02e43415d6dc77c";

    static getAllConsoles() {
        return $.get(this.url);
    }

    static getConsole(id) {
        return $.get(this.url + `/${id}`);
    }

    static createConsole(console) {
        return $.post(this.url, console);
    }

    static updateConsole(console) {
        return $.ajax({
            url: this.url + `/${console._id}`,
            dataType: "json",
            data: JSON.stringify(console),
            contentType: "application/json",
            type: "PUT"
        });
    }

    static deleteConsole(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}

class DOMManager {
    static consoles;

    static getAllConsoles() {
        ConsoleService.getAllConsoles().then(consoles => this.render(consoles));
    }

static createConsole(name) {
    ConsoleService.createConsole(new Console(name))
    .then(() => {
        return ConsoleService.getAllConsoles();
    })
    .then((consoles) => this.render(consoles));
}

    static deleteConsole(id) {
        ConsoleService.deleteConsole(id)
          .then(() => {
              return ConsoleService.getAllConsoles();
          })
          .then((consoles) => this.render(consoles));
    }

    static addGame(id) {
        for (let console of this.consoles) {
            if (console._id == id) {
                console.games.push(new Game($(`#${console._id}-game-name`).val()));
                ConsoleService.updateConsole(console)
                 .then(() => {
                     return ConsoleService.getAllConsoles();
                 })
                 .then((consoles) => this.render(consoles));
            }
        }
    }

    static deleteGame(consoleId, gameId) {
        for(let console of this.consoles) {
            if (console._id == consoleId) {
                for(let game of console.games) {
                    if(game._id == gameId) {
                        console.games.splice(console.games.indexOf(game), 1);
                        ConsoleService.updateConsole(console)
                        .then(() => {
                            return ConsoleService.getAllConsoles();
                        })
                        .then((consoles) => this.render(consoles));
                    }
                }
            }
        }
    }

        static render(consoles) {
        this.consoles = consoles;
        $('#app').empty();
        for (let console of consoles) {
            $('#app').prepend(
             `<div id="${console._id}" class="card">
                 <div class="card-header">
                  <h2>${console.name}</h2>
                  <button class="btn btn-danger" onclick="DOMManager.deleteHouse('${console._id})">Delete</button>
                </div> 
                <div class="card-body">
                   <div class="card">
                    <div class="row">
                     <div class="col-dm">
                        <input type="text" id="${console._id}-game-name" class ="form-control" placeholder="Game Name">
                     </div>
                     <div class="col-sm">
                     <input type="text" id="${console._id}-game-genre" class ="form-control" placeholder="Game Genre">
                     </div>
                   </div>
                   <button id="${console._id}-new-game" onclick="DOMManager.addGame('${console._id}')" class="btn btn-primary form-control">Add</button>
                </div>
             </div>
            </div><br>`
            );
            for (let game of console.games) {
                $(`#${console._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${game._id}"><strong>Name: </strong> ${game.name}</span>
                    <span id="name-${game._id}"><strong>Name: </strong> ${game.genre}</span>
                    <button class="btn-danger" onclick="DOMManager.deleteGame('${console._id}', '${game._id}')">Delete Game</button`
                );
            }
        }
    }

}

$('#create-new-console').click(() => {
    DOMManager.createConsole($('#new-console-name').val());
    $('#new-console-name').val('');
});

DOMManager.getAllConsoles();