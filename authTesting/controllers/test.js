t = {
grants: {},
createOwn: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
createAny: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
createSub: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
readOwn: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
readAny: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
readSub: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
updateOwn: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
updateAny: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
updateSub: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
deleteOwn: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
deleteAny: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },
deleteSub: (resource, filters = ['*']) => {
            if (this.role === "")
                return this
    
            if (this.grants[this.role][resource] === undefined)
                this.grants[this.role][resource] = {}
            
            this.grants[this.role][resource][action + ':' + possession] = cleanFilters(filters)
    
            return this
        },

}