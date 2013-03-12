// Series = new Meteor.Collection("series");

if (Meteor.isClient) {
  Template.series.series = function() {
    return Series.find({owner: Meteor.userId()}, {sort: {name: 1}});
  }

  Template.series.events({
    'click button.delete': function() {
      if(confirm("Are you sure?")) {
        console.log(this);
        Series.remove(this);
      }
    },
    'change .season': function(event) {
      Series.update(this._id, {$set: {season: event.target.value}});
    },
    'change .ep': function(event) {
      Series.update(this._id, {$set: {ep: event.target.value}});
    },
    'click .add.serie': function() {
      $('#new_serie_name').focus();
    },
    'click .delete': function() {
      if(confirm("Are you sure?"))
        Series.remove(this);
    }
  });

  Template.new_serie.events({
    'click input.add': submit,
    'keyup input#new_serie_name': function(event) {
      if(event.keyCode == 13) {
        submit();
      }
    }
  });

  Template.new_serie.rendered = function () {
    // $('.typeahead').typeahead({
    //   minLength: 4,
    //   source: function(query, typeahead) {
    //     return typeahead(getTitles(query));
    //   }
    // });
  }

  function getTitles(query) {
    console.log(query);
    return $.ajax({
      url: 'http://imdbapi.org?title=' + query + '&limit=8',
      datatype: "jsonp",
      cache: true
    }).done(function(data) {
      var map = $.map(JSON.parse(data), function(obj) {
        return obj.title;
      });
      console.log(map);
      return map;
    });
  }

  function submit() {
    var name = document.getElementById("new_serie_name");
    var nameVal = name.value.toLowerCase();
    if(nameVal.replace(/ /g, '').length === 0) {
      return false;
    }
    var url = 'http://imdbapi.org/?title=';
    url += encodeURIComponent(nameVal);
    url += '&type=json&plot=simple&limit=10';
    $.get(url).done(function(data) {
      console.log(JSON.parse(data));
      var obj = {episodes: []};
      $.each(JSON.parse(data), function() {
        console.log(JSON.stringify(this.title) + '!!!');
        if(this.title && this.title.toLowerCase() === nameVal &&
          this.episodes && this.episodes.length > obj.episodes.length) {
          obj = this;
        }
      });
      var lastEp = {season: 0, ep: 0};
      if(obj.episodes && obj.episodes.length > 0) {
        lastEp = obj.episodes[0];
      }
      console.log(lastEp);
      if(Series.insert({
        owner: Meteor.userId(),
        name: obj.title || name.value,
        season: lastEp.season,
        ep: lastEp.episode,
        poster: obj.poster,
        description: obj.plot_simple || "",
        imdb_url: obj.imdb_url || ""
      })) {
        name.value = "";
      }
    })
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}
