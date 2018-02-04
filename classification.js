const express = require('express')
const app = express.Router()

const init = connection => {

    app.use((req, res, next)=>{
        if(!req.session.user){
            res.redirect('/')
        }else{
            next()
        }
    })
    
    let classification = null

    app.get('/', async(req, res) => {
        if (classification){
            res.render('classification', {classification})
        } else{
            const query = 
                `
                select
                    users.id,
                    users.name,
                    sum(guessings.score) as score
                from
                    users
                left join
                    guessings on guessings.user_id = users.id
                group by
                    guessings.user_id
                order by
                    score DESC
                `
            
            const[rows] = await connection.execute(query)
            
            classification = rows


            res.render('classification', {classification})
        }

    })

    return app

}

module.exports = init