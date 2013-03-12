Series = new Meteor.Collection("series");

Series.allow({
  insert: function(userId, serie) {
    return userId && serie.owner === userId;
  },
  update: function(userId, series, fields, modifier) {
    return _.all(series, function(serie) {
      if(userId !== serie.owner) {
        return false;
      }
      var allowed = ['name', 'ep', 'season'];
      if(_.difference(fields, allowed).length) {
        return false;
      }
      return true;
    });
  },
  remove: function(userId, series) {
    return userId && series[0].owner === userId;
  }
});