import chai from 'chai'
import 'chai/register-should'
import dbMigration from '../migrations'

const { expect } = chai;

describe('Database Migrations', () => {
    describe('Fill test tables', () => {
        const data = {}
        before( (done) => {
            data.response = dbMigration.fillDummyData()
            done();
        })
        it("should return true on success", (done) => {
            expect(data.response).to.equal(true)
            done()
        })	
    })    
})


