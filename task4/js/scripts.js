var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
    'X-Client-Id': 1497,
    'X-Auth-Token': "804968669e1deb44669ebdf1175c773c"
};

$.ajaxSetup({
    headers: myHeaders
});

$.ajax({
    url: baseUrl + '/board',
    method: 'GET',
    success: function(response) {
        setupColumns(response.columns);
    }
});

function setupColumns(columns) {
    columns.forEach(function(column) {
        var col = new Column(column.id, column.name);
        board.createColumn(col);
        setupCards(col, column.cards);
    });
}

function setupCards(col, cards) {
    cards.forEach(function(card) {
        var card = new Card(card.id, card.name, card.bootcamp_kanban_column_id);

        col.addCard(card);
    })
}

//$(function() {



function Column(id, name) {
    var self = this;

    this.id = id;
    this.name = name || 'Nie podano nazwy';
    this.$element = createColumn();

    function createColumn() {

        var $column = $('<div>').addClass('column');
        var $columnTitle = $('<h2>').addClass('column-title').text(self.name);
        var $columnCardList = $('<ul>').addClass('column-list');
        var $columnDelete = $('<button>').addClass('btn-delete').text('X');
        var $columnAddCard = $('<button>').addClass('add-card').text('Dodaj zadanie');


        $columnDelete.click(function() {
            self.removeColumn();
        });
        $columnAddCard.click(function(event) {
            var cardName = prompt("Wpisz nazwę karty");
            event.preventDefault();

            $.ajax({
                url: baseUrl + '/card',
                method: 'POST',
                data: {
                    name: cardName,
                    bootcamp_kanban_column_id: self.id
                },
                success: function(response) {
                    var card = new Card(response.id, cardName);
                    self.addCard(card);
                }
            });
        });
        // KONSTRUOWANIE ELEMENTU KOLUMNY
        $column.append($columnTitle)
            .append($columnDelete)
            .append($columnAddCard)
            .append($columnCardList);

        // ZWRACANIE STWORZONEJ  KOLUMNY
        return $column;
    }
}
Column.prototype = {
    addCard: function(card) {
        this.$element.children('ul').append(card.$element);
    },
    removeColumn: function() {
        var self = this;
        $.ajax({
            url: baseUrl + '/column/' + self.id,
            method: 'DELETE',
            success: function() {

                self.$element.remove();

            }
        });
    }

};


function Card(id, description) {
    var self = this;

    this.id = id;
    this.description = description|| 'Nie podano nazwy';
    this.$element = createCard(); //

    function createCard() {
        // TWORZENIE KLOCKÓW
        var $card = $('<li>').addClass('card');
        var $cardDescription = $('<p>').addClass('card-description').text(self.description);
        var $cardDelete = $('<button>').addClass('btn-delete').text('X');

        // PRZYPIĘCIE ZDARZENIA
        $cardDelete.click(function() {
            self.removeCard();
        });

        // SKŁADANIE I ZWRACANIE KARTY
        $card.append($cardDelete)
            .append($cardDescription);

        return $card;
    }
}

Card.prototype = {
    removeCard: function() {
        var self = this;
        $.ajax({
            url: baseUrl + '/card/' + self.id,
            method: 'DELETE',
            success: function(){
                self.$element.remove();
            }
        });
    }}

function initSortable() {
    $('.column-list').sortable({
        connectWith: '.column-list',
        placeholder: 'card-placeholder'
    }).disableSelection();
}
var board = {
    name: 'Tablica Kanban',

    createColumn: function(column) {
        this.element.append(column.$element);
        initSortable();
    },
    element: $('#board .column-container')
};
$('.create-column')
    .click(function() {
        var columnName = prompt('Wpisz nazwę kolumny');
        $.ajax({
            url: baseUrl + '/column',
            method: 'POST',
            data: {
                name: columnName
            },
            success: function(response) {
                var column = new Column(response.id, columnName);
                board.createColumn(column);
            }
        });
    });
