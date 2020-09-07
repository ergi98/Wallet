class Helpers {

    // Helper function to return the correct date format
    static async parseDate(date) {
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        let day = date.getDate()

        return `${day}-${month}-${year}`
    }

}

module.exports = Helpers;    
