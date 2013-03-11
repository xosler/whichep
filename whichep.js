Series = new Meteor.Collection("series");

if (Meteor.isClient) {
  Template.series.series = function() {
    return Series.find({}, {sort: {season: -1, ep: -1, name: 1}});
  }

  Template.series.events({
    'click button.delete': function() {
      if(confirm("Are you sure?")) {
        Series.remove(this._id);
      }
    },
    'click button.increase.ep': function() {
      Series.update(this._id, {$inc: {ep: 1}});
    },
    'click button.increase.season': function() {
      Series.update(this._id, {$inc: {season: 1}, $set: {ep: 0}});
    }
  });

  Template.new_serie.events({
    'click input.add': function() {
      var name = document.getElementById("new_serie_name");
      Series.insert({name: name.value, season: 1, ep: 0});
      name.value = "";
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Series.find().count() === 0) {
      var names = ["The Big Bang Theory",
                  "Dexter",
                  "The Walking Dead",
                  "Spartacus",
                  "Wilfred",
                  "Other"];
      for (var i = 0; i < names.length; i++)
        Series.insert({name: names[i], season: 1, ep: 0});
    }
  });
}
