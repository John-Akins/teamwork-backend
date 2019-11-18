import chai from 'chai'
import 'chai/register-should'
import dbMigration from '../migrations/'

const { expect } = chai;

describe('Database Migrations', () => {
    describe('Schema Migrations', () => {
        const data = {}
        before( (done) => {
            data.response = dbMigration.createTables()
            done()
        })
    
        it("should reply with true on success", (done) => {
            expect(data.response).to.equal("success")
            done()
        })	
    })
})
