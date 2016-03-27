import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        /* jshint ignore:start */
        CKEDITOR.replace('ruleBody');
        /* jshint ignore:end */
      });
    },

    save() {
      /* jshint ignore:start */
      Ember.$('#saveButton').hide();

      var title = Ember.$('#ruleTitle').val();
      var position = Ember.$('#rulePosition').val();
      var body = CKEDITOR.instances.ruleBody.getData();

      this.get('ajax').post('/admin/rules', {
        data: {
          title: title,
          body: body,
          position: position,
          apikey: this.get('user').getApiKey()
        }
      }).then(() => {
        this.get('toast').success('Created new rule.');
        this.transitionTo('admin-rules');
      }).catch((err) => {
        this.get('errorHandler').handleError(err, 'Unable to create rule.');
        Ember.$('#saveButton').show();
      });
      /* jshint ignore:end */
    }
  }
});