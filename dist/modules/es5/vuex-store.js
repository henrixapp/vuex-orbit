function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

import Store from '@orbit/store';

var VuexStore = function (_Store) {
    _inherits(VuexStore, _Store);

    function VuexStore() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, VuexStore);

        var _this = _possibleConstructorReturn(this, _Store.call(this, settings));

        _this.namespaced = false;
        if (settings.schema) {
            //generate vuex store
            _this.state = _this.state || {};
            Object.keys(_this._schema.models).forEach(function (type) {
                var model = settings.schema.getModel(type);
                _this.state = _this.state || {};
                //add to state
                _this.state[_this._schema.singularize(type)] = model;
                _this.state[_this._schema.pluralize(type)] = [];
            });
            //map fields
            _this.getters = {
                getField: function (state) {
                    return function (path) {
                        return path.split(/[.[\]]+/).reduce(function (prev, key) {
                            return prev[key];
                        }, state);
                    };
                }
            };
            _this.actions = {
                //TODO: Add fetch settings like json api
                create: function (_ref, record) {
                    var commit = _ref.commit,
                        dispatch = _ref.dispatch;

                    _this.update(function (t) {
                        return t.addRecord(record);
                    }).then(function (data) {
                        dispatch("fetchAllOf", record.type);
                        commit("set", { record: record, model: _this._schema.singularize(record.type) });
                        //TODO: relationships 
                    });
                },
                /**
                 * @argument model: The model as singularized name
                 */
                fetchAllOf: function (_ref2, model) {
                    var commit = _ref2.commit;

                    _this.query(function (q) {
                        return q.findRecords(model);
                    }).then(function (data) {
                        commit('set', { data: data, model: _this._schema.pluralize(model) });
                    });
                },
                fetchAllRelatedOf: function (_ref3, query) {
                    var commit = _ref3.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecords(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchRelatedOf: function (_ref4, query) {
                    var commit = _ref4.commit;

                    _this.query(function (q) {
                        return q.findRelatedRecord(query.data, query.relationship);
                    }).then(function (data) {
                        commit('set', { data: data, model: query.relationship });
                    });
                },
                fetchOne: function (_ref5, _ref6) {
                    var commit = _ref5.commit;
                    var model = _ref6.model,
                        id = _ref6.id;

                    _this.query(function (q) {
                        return q.findRecord({ type: model, id: id });
                    }).then(function (data) {
                        return commit('set', { data: data, model: _this._schema.singularize(model) });
                    });
                },
                update: function (_ref7, data) {
                    var commit = _ref7.commit;

                    _this.update(function (t) {
                        return t.replaceRecord(data);
                    }).then(function () {
                        return commit('set', { data: data, model: data.type });
                    });
                },
                delete: function (_ref8, data) {
                    var commit = _ref8.commit,
                        dispatch = _ref8.dispatch;

                    _this.update(function (t) {
                        return t.removeRecord(data);
                    }).then(function () {
                        //update
                        dispatch("fetchAllOf", data.type);
                    });
                }
                //TODO: RelatedRecords update and delete
            };
            _this.mutations = {
                set: function (state, _ref9) {
                    var data = _ref9.data,
                        model = _ref9.model;

                    state[model] = data;
                    if (model.lastIndexOf('s') !== model.length - 1) {
                        state[_this.schema.pluralize(model)].forEach(function (item) {
                            if (item.id === data.id) {
                                item.attributes = data.attributes;
                                item.relationships = data.relationships;
                                item.keys = data.keys;
                            }
                        });
                    }
                },
                updateField: function (state, _ref10) {
                    var path = _ref10.path,
                        value = _ref10.value;

                    //set in field
                    path.split(/[.[\]]+/).reduce(function (prev, key, index, array) {
                        if (array.length === index + 1) {
                            // eslint-disable-next-line no-param-reassign
                            prev[key] = value;
                        }
                        return prev[key];
                    }, state);
                }
            };
        }
        return _this;
    }

    return VuexStore;
}(Store);

export default VuexStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwic2luZ3VsYXJpemUiLCJwbHVyYWxpemUiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJwYXRoIiwic3BsaXQiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiYWN0aW9ucyIsImNyZWF0ZSIsInJlY29yZCIsImNvbW1pdCIsImRpc3BhdGNoIiwidXBkYXRlIiwidCIsImFkZFJlY29yZCIsInRoZW4iLCJmZXRjaEFsbE9mIiwicXVlcnkiLCJxIiwiZmluZFJlY29yZHMiLCJkYXRhIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJmZXRjaFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZmV0Y2hPbmUiLCJpZCIsImZpbmRSZWNvcmQiLCJyZXBsYWNlUmVjb3JkIiwiZGVsZXRlIiwicmVtb3ZlUmVjb3JkIiwibXV0YXRpb25zIiwic2V0IiwibGFzdEluZGV4T2YiLCJsZW5ndGgiLCJpdGVtIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJ1cGRhdGVGaWVsZCIsInZhbHVlIiwiaW5kZXgiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLE1BQWtCLGNBQWxCOztJQUNxQkMsUzs7O0FBQ2pCLHlCQUEyQjtBQUFBLFlBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSxxREFDdkIsa0JBQU1BLFFBQU4sQ0FEdUI7O0FBRXZCLGNBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxZQUFJRCxTQUFTRSxNQUFiLEVBQXFCO0FBQ2pCO0FBQ0Esa0JBQUtDLEtBQUwsR0FBYSxNQUFLQSxL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dnVleC1zdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdG9yZSBmcm9tICdAb3JiaXQvc3RvcmUnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVnVleFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLm5hbWVzcGFjZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHNldHRpbmdzLnNjaGVtYSkge1xuICAgICAgICAgICAgLy9nZW5lcmF0ZSB2dWV4IHN0b3JlXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsID0gc2V0dGluZ3Muc2NoZW1hLmdldE1vZGVsKHR5cGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgICAgIC8vYWRkIHRvIHN0YXRlXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUodHlwZSldID0gbW9kZWw7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEucGx1cmFsaXplKHR5cGUpXSA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL21hcCBmaWVsZHNcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVycyA9IHtcbiAgICAgICAgICAgICAgICBnZXRGaWVsZDogc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aCA9PiBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5KSA9PiBwcmV2W2tleV0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vVE9ETzogQWRkIGZldGNoIHNldHRpbmdzIGxpa2UganNvbiBhcGlcbiAgICAgICAgICAgICAgICBjcmVhdGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5hZGRSZWNvcmQocmVjb3JkKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCByZWNvcmQudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoXCJzZXRcIiwgeyByZWNvcmQsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUocmVjb3JkLnR5cGUpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiByZWxhdGlvbnNoaXBzIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBhcmd1bWVudCBtb2RlbDogVGhlIG1vZGVsIGFzIHNpbmd1bGFyaXplZCBuYW1lXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxPZjogKHsgY29tbWl0IH0sIG1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmRzKG1vZGVsKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZHMocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmQocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoT25lOiAoeyBjb21taXQgfSwgeyBtb2RlbCwgaWQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3JkKHsgdHlwZTogbW9kZWwsIGlkIH0pKS50aGVuKGRhdGEgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUobW9kZWwpIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVwZGF0ZTogKHsgY29tbWl0IH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnJlcGxhY2VSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiBkYXRhLnR5cGUgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVsZXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnJlbW92ZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3VwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goXCJmZXRjaEFsbE9mXCIsIGRhdGEudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL1RPRE86IFJlbGF0ZWRSZWNvcmRzIHVwZGF0ZSBhbmQgZGVsZXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==