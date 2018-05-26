'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = require('@orbit/store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class VuexStore extends _store2.default {
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
exports.default = VuexStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiVnVleFN0b3JlIiwiU3RvcmUiLCJjb25zdHJ1Y3RvciIsInNldHRpbmdzIiwibmFtZXNwYWNlZCIsInNjaGVtYSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsInR5cGUiLCJtb2RlbCIsImdldE1vZGVsIiwic3RhdGUiLCJzaW5ndWxhcml6ZSIsInBsdXJhbGl6ZSIsImdldHRlcnMiLCJnZXRGaWVsZCIsInBhdGgiLCJzcGxpdCIsInJlZHVjZSIsInByZXYiLCJrZXkiLCJhY3Rpb25zIiwiZmV0Y2hBbGxPZiIsImNvbW1pdCIsInF1ZXJ5IiwicSIsImZpbmRSZWNvcmRzIiwidGhlbiIsImRhdGEiLCJmZXRjaE9uZSIsImlkIiwiZmluZFJlY29yZCIsInVwZGF0ZSIsInQiLCJyZXBsYWNlUmVjb3JkIiwibXV0YXRpb25zIiwic2V0IiwibGFzdEluZGV4T2YiLCJsZW5ndGgiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJ1cGRhdGVGaWVsZCIsInZhbHVlIiwiaW5kZXgiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUNlLE1BQU1BLFNBQU4sU0FBd0JDLGVBQXhCLENBQThCO0FBQ3pDQyxnQkFBWUMsV0FBVyxFQUF2QixFQUEyQjtBQUN2QixjQUFNQSxRQUFOO0FBQ0EsYUFBS0MsVUFBTCxHQUFrQixLQUFsQjtBQUNBLFlBQUlELFNBQVNFLE1BQWIsRUFBcUI7QUFDakI7QUFDQUMsbUJBQU9DLElBQVAsQ0FBWSxLQUFLQyxPQUFMLENBQWFDLE1BQXpCLEVBQWlDQyxPQUFqQyxDQUF5Q0MsUUFBUTtBQUM3QyxvQkFBSUMsUUFBUVQsU0FBU0UsTUFBVCxDQUFnQlEsUUFBaEIsQ0FBeUJGLElBQXpCLENBQVo7QUFDQTtBQUNBLHFCQUFLRyxLQUFMLENBQVcsS0FBS04sT0FBTCxDQUFhTyxXQUFiLENBQXlCSixJQUF6QixDQUFYLElBQTZDQyxLQUE3QztBQUNBLHFCQUFLRSxLQUFMLENBQVcsS0FBS04sT0FBTCxDQUFhUSxTQUFiLENBQXVCTCxJQUF2QixDQUFYLElBQTJDLEVBQTNDO0FBQ0gsYUFMRDtBQU1BO0FBQ0EsaUJBQUtNLE9BQUwsR0FBZTtBQUNYQywwQkFBVUosU0FBUztBQUNmLDJCQUFPSyxRQUFRQSxLQUFLQyxLQUFMLENBQVcsU0FBWCxFQUFzQkMsTUFBdEIsQ0FBNkIsQ0FBQ0MsSUFBRCxFQUFPQyxHQUFQLEtBQWVELEtBQUtDLEdBQUwsQ0FBNUMsRUFBdURULEtBQXZELENBQWY7QUFDSDtBQUhVLGFBQWY7QUFLQSxpQkFBS1UsT0FBTCxHQUFlO0FBQ1g7QUFDQTs7O0FBR0FDLDRCQUFZLENBQUMsRUFBRUMsTUFBRixFQUFELEVBQWFkLEtBQWIsS0FBdUI7QUFDL0IseUJBQUtlLEtBQUwsQ0FBV0MsS0FBS0EsRUFBRUMsV0FBRixDQUFjakIsS0FBZCxDQUFoQixFQUFzQ2tCLElBQXRDLENBQTJDQyxRQUFRO0FBQy9DTCwrQkFBTyxLQUFQLEVBQWMsRUFBRUssSUFBRixFQUFRbkIsT0FBTyxLQUFLSixPQUFMLENBQWFRLFNBQWIsQ0FBdUJKLEtBQXZCLENBQWYsRUFBZDtBQUNILHFCQUZEO0FBR0gsaUJBVFU7QUFVWG9CLDBCQUFVLENBQUMsRUFBRU4sTUFBRixFQUFELEVBQWEsRUFBRWQsS0FBRixFQUFTcUIsRUFBVCxFQUFiLEtBQStCO0FBQ3JDLHlCQUFLTixLQUFMLENBQVdDLEtBQUtBLEVBQUVNLFVBQUYsQ0FBYSxFQUFFdkIsTUFBTUMsS0FBUixFQUFlcUIsRUFBZixFQUFiLENBQWhCLEVBQW1ESCxJQUFuRCxDQUF3REMsUUFBUUwsT0FBTyxLQUFQLEVBQWMsRUFBRUssSUFBRixFQUFRbkIsT0FBTyxLQUFLSixPQUFMLENBQWFPLFdBQWIsQ0FBeUJILEtBQXpCLENBQWYsRUFBZCxDQUFoRTtBQUNILGlCQVpVO0FBYVh1Qix3QkFBUSxDQUFDLEVBQUVULE1BQUYsRUFBRCxFQUFhSyxJQUFiLEtBQXNCO0FBQzFCLHlCQUFLSSxNQUFMLENBQVlDLEtBQUtBLEVBQUVDLGFBQUYsQ0FBZ0JOLElBQWhCLENBQWpCLEVBQXdDRCxJQUF4QyxDQUE2QyxNQUFNSixPQUFPLEtBQVAsRUFBYyxFQUFFSyxJQUFGLEVBQVFuQixPQUFPbUIsS0FBS3BCLElBQXBCLEVBQWQsQ0FBbkQ7QUFDSDtBQWZVLGFBQWY7QUFpQkEsaUJBQUsyQixTQUFMLEdBQWlCO0FBQ2JDLHFCQUFLLENBQUN6QixLQUFELEVBQVEsRUFBRWlCLElBQUYsRUFBUW5CLEtBQVIsRUFBUixLQUE0QjtBQUM3QkUsMEJBQU1GLEtBQU4sSUFBZW1CLElBQWY7QUFDQSx3QkFBSW5CLE1BQU00QixXQUFOLENBQWtCLEdBQWxCLE1BQTJCNUIsTUFBTTZCLE1BQU4sR0FBZSxDQUE5QyxFQUFpRDtBQUM3QzNCLDhCQUFNLEtBQUtULE1BQUwsQ0FBWVcsU0FBWixDQUFzQkosS0FBdEIsQ0FBTixFQUFvQ0YsT0FBcEMsQ0FBNENnQyxRQUFRO0FBQ2hELGdDQUFJQSxLQUFLVCxFQUFMLEtBQVlGLEtBQUtFLEVBQXJCLEVBQXlCO0FBQ3JCUyxxQ0FBS0MsVUFBTCxHQUFrQlosS0FBS1ksVUFBdkI7QUFDQUQscUNBQUtFLGFBQUwsR0FBcUJiLEtBQUthLGFBQTFCO0FBQ0FGLHFDQUFLbkMsSUFBTCxHQUFZd0IsS0FBS3hCLElBQWpCO0FBQ0g7QUFDSix5QkFORDtBQU9IO0FBQ0osaUJBWlk7QUFhYnNDLDZCQUFhLENBQUMvQixLQUFELEVBQVEsRUFBRUssSUFBRixFQUFRMkIsS0FBUixFQUFSLEtBQTRCO0FBQ3JDO0FBQ0EzQix5QkFBS0MsS0FBTCxDQUFXLFNBQVgsRUFBc0JDLE1BQXRCLENBQTZCLENBQUNDLElBQUQsRUFBT0MsR0FBUCxFQUFZd0IsS0FBWixFQUFtQkMsS0FBbkIsS0FBNkI7QUFDdEQsNEJBQUlBLE1BQU1QLE1BQU4sS0FBaUJNLFFBQVEsQ0FBN0IsRUFBZ0M7QUFDNUI7QUFDQXpCLGlDQUFLQyxHQUFMLElBQVl1QixLQUFaO0FBQ0g7QUFDRCwrQkFBT3hCLEtBQUtDLEdBQUwsQ0FBUDtBQUNILHFCQU5ELEVBTUdULEtBTkg7QUFPSDtBQXRCWSxhQUFqQjtBQXdCSDtBQUNKO0FBNUR3QztrQkFBeEJkLFMiLCJmaWxlIjoidnVleC1zdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdG9yZSBmcm9tICdAb3JiaXQvc3RvcmUnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVnVleFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLm5hbWVzcGFjZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHNldHRpbmdzLnNjaGVtYSkge1xuICAgICAgICAgICAgLy9nZW5lcmF0ZSB2dWV4IHN0b3JlXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9zY2hlbWEubW9kZWxzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtb2RlbCA9IHNldHRpbmdzLnNjaGVtYS5nZXRNb2RlbCh0eXBlKTtcbiAgICAgICAgICAgICAgICAvL2FkZCB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKHR5cGUpXSA9IG1vZGVsO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVbdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZSh0eXBlKV0gPSBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9tYXAgZmllbGRzXG4gICAgICAgICAgICB0aGlzLmdldHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgZ2V0RmllbGQ6IHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhdGggPT4gcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4gcHJldltrZXldLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCBmZXRjaCBzZXR0aW5ncyBsaWtlIGpzb24gYXBpXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGFyZ3VtZW50IG1vZGVsOiBUaGUgbW9kZWwgYXMgc2luZ3VsYXJpemVkIG5hbWVcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBmZXRjaEFsbE9mOiAoeyBjb21taXQgfSwgbW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZHMobW9kZWwpKS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEucGx1cmFsaXplKG1vZGVsKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmZXRjaE9uZTogKHsgY29tbWl0IH0sIHsgbW9kZWwsIGlkIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlY29yZCh7IHR5cGU6IG1vZGVsLCBpZCB9KSkudGhlbihkYXRhID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnNpbmd1bGFyaXplKG1vZGVsKSB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGU6ICh7IGNvbW1pdCB9LCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5yZXBsYWNlUmVjb3JkKGRhdGEpKS50aGVuKCgpID0+IGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==