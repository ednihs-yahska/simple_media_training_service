class DBLayer {
    constructor(connection) {
        this.connection = connection
    }

    createMany() {

    }

    createOne(collection, entry) {
        return new Promise((resolve, reject)=>{
            this.connection.collection(collection).insertOne(entry, (err, result)=>{
                if(err){
                    reject(err)
                    return
                }
                resolve(entry)
            })
        }) 
    }

    modifyOne(collection, query, newVal) {
        dbo.collection(collection).updateOne(query, {$set: newVal}, (err, result)=>{
            if(err){ reject(err); return}
            resolve(result.updatedCount)
        })
    }

    deleteOne(collection, query) {
        return new Promise((resolve, reject)=>{
            dbo.collection(collection).deleteOne(query, (error, result)=>{
                if(err){ reject(err); return}
                resove(result.deletedCount);
            })
        })
        
    }

    getOne() {

    }

    getMany(collection, query) {
        return new Promise((resolve, reject)=>{
            dbo.collection(collection).find(query).toArray((err, result)=>{
                if(err){ reject(err); return}
                resolve(result)
            })
        })
    }

    get() {

    }
}