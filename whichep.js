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
    'click button.increase.ep': function() {
      Series.update(this._id, {$inc: {ep: 1}});
    },
    'click button.decrease.ep': function() {
      if(this.ep > 0) {
        Series.update(this._id, {$inc: {ep: -1}});
      }
    },
    'click button.increase.season': function() {
      Series.update(this._id, {$inc: {season: 1}, $set: {ep: 0}});
    },
    'click button.decrease.season': function() {
      if(this.season > 0) {
        Series.update(this._id, {$inc: {season: -1}});
      }
    },
    'click .add.serie': function() {
      $('#new_serie_name').focus();
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
    if(Series.insert({
      owner: Meteor.userId(),
      name: name.value,
      season: 1,
      ep: 0
    })) {
      name.value = "";
    }
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}
