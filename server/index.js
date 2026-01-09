import express, { request } from 'express';

const app = express();
app.use(express.json());
const PORT = 3000;




const list = [
    {
        id: 1, 
        title: "Assignment",
        status: "pending"
    },

    {
        id: 2, 
        title: "Daily Chores",
        status: "pending"
    },
]

    const items = [
        {
            id: 1,
            list_id: 1,
            description: "Programming",
            status: "pending"
        },
        {
            id: 2,
            list_id: 1,
            description: "Web dev",
            status: "pending"
        },
        {
            id:3,
            list_id: 2,
            description: "Washing dish",
            status: "pending"
        },
        {
            id: 4,
            list_id: 2,
            description: "Clean the room",
            status: "pending"
        }
    ]



app.get('/get-list', (req, res) =>  {
    res.status(200).json({success: true,list:list});
});


app.get('/get-items/:id', (req, res) => {

    const listId = req.params.id;


    const filtered = items.filter(
        item => item.list_id ==  listId
    );

    if(filtered.length === 0) {
        res.status(200).json({
            success: false,
            message: "list not found"
        });
    }

    res.status(200).json({ success: true, items: filtered })
});

app.post('/add-list', (req, res) => {
    const { listTitle } = req.body;

    list.push({
        id: 3,
        id:list.length+1,
        title: listTitle,
        status: "pending"
    });
    res.status(200).json({
        success:true,
        list,
        message:"yowwn mayt metlngen boss"
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT} `);
});

app.get('/home', (req, res) =>  {
    res.send('this is home page :');
});

app.get('/add-list', (req, res) =>  {
    res.send('pak mio ikong des');
});

app.get('/edit-list', (req, res) =>  {
    res.send('8080 ka lattan');
});

app.get('/delete-list', (req, res) =>  {
    res.send('baamon');
});

app.get('/get-item', (req, res) =>  {
    res.send('one v one?');
});

app.get('/add-item', (req, res) =>  {
    res.send('bubu ka pala');
});

app.get('/edit-item', (req, res) =>  {
    res.send('boy');
});

app.get('/delete-item', (req, res) =>  {
    res.send('shet');
});



app.listen(PORT , () => {
    console.log(`Server listening on port ${PORT}`);
});


