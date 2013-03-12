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

  function submit() {
    var name = document.getElementById("new_serie_name");
    if(name.value.replace(/ /g, '').length === 0) {
      return false;
    }
    var url = 'http://imdbapi.org/?title=';
    url += encodeURIComponent(name.value);
    url += '&type=json&plot=simple&limit=1';
    $.get(url).done(function(data) {
      console.log(JSON.parse(data));
      var obj = JSON.parse(data)[0];
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
        poster: obj.poster
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
