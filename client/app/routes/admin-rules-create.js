import Ember from 'ember';
import config from '../config/environment';
import ResetScrollMixin from '../mixins/reset-scroll';

/* globals CKEDITOR */
export default Ember.Route.extend(ResetScrollMixin, {
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  errorHandler: Ember.inject.service(),
  user: Ember.inject.service(),

  actions: {
    didTransition() {
      Ember.run.scheduleOnce('afterRender', this, () => {
        Ember.$.getScript(config.APP.ckeditor.script, () => {
          CKEDITOR.config.extraPlugins = config.APP.ckeditor.extraPlugins;
          CKEDITOR.replace('ruleBody');
        });
      });
    },

    save() {
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
    }
  }
});
