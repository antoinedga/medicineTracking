const camelCase = require('camelcase');

Actions = {
    CREATE: "create",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete"
}

Possessions = {
    OWN: "own",
    ANY: "any",
    SUB: "sub"
}


class AccessControl {
    constructor() {
        this.grants = {};

        Object.values(Actions).forEach(action => {
            Object.values(Possessions).forEach(possession => {
                this.addAction(action,possession)
            })
        })
    }

    addAction(action,possession) {
        this[camelCase([action, possession])] = (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        }
    }

    grant(role, location = '') {
        this.role = role + ':' + location
        if (this.grants[this.role] === undefined)
            this.grants[this.role] = {}
        
        return this
    }

    can(role) {
        return new Query(this.grants, role)
    }
}

class Query {
    constructor(grants, role) {
        this._ = {}
        this._grants = grants
        this._.role = role

        Object.values(Actions).forEach(action => {
            Object.values(Possessions).forEach(possession => {
                this.addAction(action,possession)
            })
        })
    }

    addAction(action, possession) { 
        this[camelCase([action, possession])] = (resource) => {
            return this._getPermission(action, possession, resource);
        }
    }

    _getPermission(action, possession, resource){
        this._.action = action;
        this._.possession = possession;
        this._.resource = resource;

        return new Permission(this._grants, this._);
    }
}

cleanFilters = (filters) => {
    if (typeof filters === 'string')
        filters = [filters]
    
    if (!Array.isArray(filters))
        return []

    return filters
}

ac = new Query()

ac.addAction
module.exports = AccessControl


// t = {
//     name: 'admin',
//     location: '~/inv1/inv2',
//     resource: 'resource1',
//     action: 'create:any',
//     attributes: [ '*', '!_id' ]
// }