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
                        commit("set", { data: record, model: _this._schema.singularize(record.type) });
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
                /*update: ({ commit }, data: Record) => {
                    this.update((t) => t.replaceRecord(data)).then(() =>
                        commit('set', { data, model: data.type })
                    )
                },*/
                delete: function (_ref7, data) {
                    var commit = _ref7.commit,
                        dispatch = _ref7.dispatch;

                    _this.update(function (t) {
                        return t.removeRecord(data);
                    }).then(function () {
                        //update
                        dispatch("fetchAllOf", data.type);
                    });
                },
                updating: function (store, options) {
                    _this.update(options.transformOrOperations).then(function (data) {
                        options.thenable(store, data);
                    });
                },
                querying: function (store, options) {
                    _this.query(function (q) {
                        return options.queryOrExpression(q);
                    }).then(function (data) {
                        options.thenable(store, data);
                    });
                }
                //TODO: RelatedRecords update and delete
            };
            _this.mutations = {
                set: function (state, _ref8) {
                    var data = _ref8.data,
                        model = _ref8.model;

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
                updateField: function (state, _ref9) {
                    var path = _ref9.path,
                        value = _ref9.value;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZ1ZXgtc3RvcmUuanMiXSwibmFtZXMiOlsiU3RvcmUiLCJWdWV4U3RvcmUiLCJzZXR0aW5ncyIsIm5hbWVzcGFjZWQiLCJzY2hlbWEiLCJzdGF0ZSIsIk9iamVjdCIsImtleXMiLCJfc2NoZW1hIiwibW9kZWxzIiwiZm9yRWFjaCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJ0eXBlIiwic2luZ3VsYXJpemUiLCJwbHVyYWxpemUiLCJnZXR0ZXJzIiwiZ2V0RmllbGQiLCJwYXRoIiwic3BsaXQiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiYWN0aW9ucyIsImNyZWF0ZSIsInJlY29yZCIsImNvbW1pdCIsImRpc3BhdGNoIiwidXBkYXRlIiwidCIsImFkZFJlY29yZCIsInRoZW4iLCJkYXRhIiwiZmV0Y2hBbGxPZiIsInF1ZXJ5IiwicSIsImZpbmRSZWNvcmRzIiwiZmV0Y2hBbGxSZWxhdGVkT2YiLCJmaW5kUmVsYXRlZFJlY29yZHMiLCJyZWxhdGlvbnNoaXAiLCJmZXRjaFJlbGF0ZWRPZiIsImZpbmRSZWxhdGVkUmVjb3JkIiwiZmV0Y2hPbmUiLCJpZCIsImZpbmRSZWNvcmQiLCJkZWxldGUiLCJyZW1vdmVSZWNvcmQiLCJ1cGRhdGluZyIsInN0b3JlIiwib3B0aW9ucyIsInRyYW5zZm9ybU9yT3BlcmF0aW9ucyIsInRoZW5hYmxlIiwicXVlcnlpbmciLCJxdWVyeU9yRXhwcmVzc2lvbiIsIm11dGF0aW9ucyIsInNldCIsImxhc3RJbmRleE9mIiwibGVuZ3RoIiwiaXRlbSIsImF0dHJpYnV0ZXMiLCJyZWxhdGlvbnNoaXBzIiwidXBkYXRlRmllbGQiLCJ2YWx1ZSIsImluZGV4IiwiYXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxNQUFrQixjQUFsQjs7SUFDcUJDLFM7OztBQUNqQix5QkFBMkI7QUFBQSxZQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUEscURBQ3ZCLGtCQUFNQSxRQUFOLENBRHVCOztBQUV2QixjQUFLQyxV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QUFtQkMsS0FBbkIsRUFBNkI7QUFDdEQsNEJBQUlBLE1BQU1QLE1BQU4sS0FBaUJNLFFBQVEsQ0FBN0IsRUFBZ0M7QUFDNUI7QUFDQTFDLGlDQUFLQyxHQUFMLElBQVl3QyxLQUFaO0FBQ0g7QUFDRCwrQkFBT3pDLEtBQUtDLEdBQUwsQ0FBUDtBQUNILHFCQU5ELEVBTUdqQixLQU5IO0FBT0g7QUF0QlksYUFBakI7QUF3Qkg7QUFsR3NCO0FBbUcxQjs7O0VBcEdrQ0wsSzs7ZUFBbEJDLFMiLCJmaWxlIjoidnVleC1zdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdG9yZSBmcm9tICdAb3JiaXQvc3RvcmUnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVnVleFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLm5hbWVzcGFjZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHNldHRpbmdzLnNjaGVtYSkge1xuICAgICAgICAgICAgLy9nZW5lcmF0ZSB2dWV4IHN0b3JlXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3NjaGVtYS5tb2RlbHMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsID0gc2V0dGluZ3Muc2NoZW1hLmdldE1vZGVsKHR5cGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlIHx8IHt9O1xuICAgICAgICAgICAgICAgIC8vYWRkIHRvIHN0YXRlXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUodHlwZSldID0gbW9kZWw7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVt0aGlzLl9zY2hlbWEucGx1cmFsaXplKHR5cGUpXSA9IFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL21hcCBmaWVsZHNcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVycyA9IHtcbiAgICAgICAgICAgICAgICBnZXRGaWVsZDogc3RhdGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aCA9PiBwYXRoLnNwbGl0KC9bLltcXF1dKy8pLnJlZHVjZSgocHJldiwga2V5KSA9PiBwcmV2W2tleV0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vVE9ETzogQWRkIGZldGNoIHNldHRpbmdzIGxpa2UganNvbiBhcGlcbiAgICAgICAgICAgICAgICBjcmVhdGU6ICh7IGNvbW1pdCwgZGlzcGF0Y2ggfSwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHQgPT4gdC5hZGRSZWNvcmQocmVjb3JkKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKFwiZmV0Y2hBbGxPZlwiLCByZWNvcmQudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21taXQoXCJzZXRcIiwgeyBkYXRhOiByZWNvcmQsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUocmVjb3JkLnR5cGUpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiByZWxhdGlvbnNoaXBzIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEBhcmd1bWVudCBtb2RlbDogVGhlIG1vZGVsIGFzIHNpbmd1bGFyaXplZCBuYW1lXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxPZjogKHsgY29tbWl0IH0sIG1vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkocSA9PiBxLmZpbmRSZWNvcmRzKG1vZGVsKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogdGhpcy5fc2NoZW1hLnBsdXJhbGl6ZShtb2RlbCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmV0Y2hBbGxSZWxhdGVkT2Y6ICh7IGNvbW1pdCB9LCBxdWVyeSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVsYXRlZFJlY29yZHMocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoUmVsYXRlZE9mOiAoeyBjb21taXQgfSwgcXVlcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHEuZmluZFJlbGF0ZWRSZWNvcmQocXVlcnkuZGF0YSwgcXVlcnkucmVsYXRpb25zaGlwKSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogcXVlcnkucmVsYXRpb25zaGlwIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZldGNoT25lOiAoeyBjb21taXQgfSwgeyBtb2RlbCwgaWQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5KHEgPT4gcS5maW5kUmVjb3JkKHsgdHlwZTogbW9kZWwsIGlkIH0pKS50aGVuKGRhdGEgPT4gY29tbWl0KCdzZXQnLCB7IGRhdGEsIG1vZGVsOiB0aGlzLl9zY2hlbWEuc2luZ3VsYXJpemUobW9kZWwpIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8qdXBkYXRlOiAoeyBjb21taXQgfSwgZGF0YTogUmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCh0KSA9PiB0LnJlcGxhY2VSZWNvcmQoZGF0YSkpLnRoZW4oKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1pdCgnc2V0JywgeyBkYXRhLCBtb2RlbDogZGF0YS50eXBlIH0pXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9LCovXG4gICAgICAgICAgICAgICAgZGVsZXRlOiAoeyBjb21taXQsIGRpc3BhdGNoIH0sIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGUodCA9PiB0LnJlbW92ZVJlY29yZChkYXRhKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3VwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2goXCJmZXRjaEFsbE9mXCIsIGRhdGEudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRpbmc6IChzdG9yZSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZShvcHRpb25zLnRyYW5zZm9ybU9yT3BlcmF0aW9ucykudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGhlbmFibGUoc3RvcmUsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5aW5nOiAoc3RvcmUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVyeShxID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLnF1ZXJ5T3JFeHByZXNzaW9uKHEpO1xuICAgICAgICAgICAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aGVuYWJsZShzdG9yZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL1RPRE86IFJlbGF0ZWRSZWNvcmRzIHVwZGF0ZSBhbmQgZGVsZXRlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgc2V0OiAoc3RhdGUsIHsgZGF0YSwgbW9kZWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZVttb2RlbF0gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWwubGFzdEluZGV4T2YoJ3MnKSAhPT0gbW9kZWwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVbdGhpcy5zY2hlbWEucGx1cmFsaXplKG1vZGVsKV0uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gZGF0YS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmF0dHJpYnV0ZXMgPSBkYXRhLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucmVsYXRpb25zaGlwcyA9IGRhdGEucmVsYXRpb25zaGlwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5rZXlzID0gZGF0YS5rZXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZDogKHN0YXRlLCB7IHBhdGgsIHZhbHVlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXQgaW4gZmllbGRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5zcGxpdCgvWy5bXFxdXSsvKS5yZWR1Y2UoKHByZXYsIGtleSwgaW5kZXgsIGFycmF5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXkubGVuZ3RoID09PSBpbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==