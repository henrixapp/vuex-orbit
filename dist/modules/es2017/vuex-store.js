import Store from '@orbit/store';
export default class VuexStore extends Store {
    constructor(settings = {}) {
        super(settings);
        this.namespaced = false;
        if (settings.schema) {
            //generate vuex store
            Object.keys(this._schema.models).forEach(type => {
                let model = settings.schema.getModel(type);
                //add to state
                this.state[this._schema.singularize(type)] = model;
                this.state[this._schema.pluralize(type)] = [];
            });
            //map fields
            this.getters = {
                getField: state => {
                    return path => path.split(/[.[\]]+/).reduce((prev, key) => prev[key], state);
                }
            };
            this.actions = {
                //TODO: Add fetch settings like json api
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: ({ commit }, model) => {
                    this.query(q => q.findRecords(model)).then(data => {
                        commit('set', { data, model: this._schema.pluralize(model) });
                    });
                },
                fetchOne: ({ commit }, { model, id }) => {
                    this.query(q => q.findRecord({ type: model, id })).then(data => commit('set', { data, model: this._schema.singularize(model) }));
                },
                update: ({ commit }, data) => {
                    this.update(t => t.replaceRecord(data)).then(() => commit('set', { data, model: data.type }));
                }
            };
            this.mutations = {
                set: (state, { data, model }) => {
                    state[model] = data;
                    if (model.lastIndexOf('s') !== model.length - 1) {
                        state[this.schema.pluralize(model)].forEach(item => {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                            }
                        });
                    }
                },
                updateField: (state, { path, value }) => {
                    //set in field
                    path.split(/[.[\]]+/).reduce((prev, key, index, array) => {
                        if (array.length === index + 1) {
                            // eslint-disable-next-line no-param-reassign
                            prev[key] = value;
                        }
                        return prev[key];
                    }, state);
                }
            };
        }
    }
}