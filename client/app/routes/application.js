import Ember from 'ember';

export default Ember.Route.extend({
  intl: Ember.inject.service(),
  user: Ember.inject.service(),

  beforeModel() {
    return this.get('intl').setLocale('en-us');
  },

  model() {
    return {
      user: {
        loggedIn: this.get('user').isLoggedIn()
      }
    };
  },

  actions: {
    login() {
      this.get('user').login().then(() => {
        location.reload();
      }).catch(() => {
        location.reload();
      });
    },

    logout() {
      this.get('user').logout().then(() => {
        this.transitionTo('status');
        this.refresh();
      }).catch(() => {
        this.transitionTo('status');
        this.refresh();
      });
    }
  }
});