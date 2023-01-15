const {io} = require ('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');
const bands=new Bands();
bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del Silencio'));
bands.addBand(new Band('Metallica'));
bands.addBand(new Band('The Beatles'));
console.log(bands);

//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    client.emit('active-bands',bands.getBands());
    client.on('disconnect', () => { console.log('Cliente desconectado') });
    client.on('connect', () => { console.log('Cliente conectado') });

    client.on('mensaje',(payload)=>{
        console.log('Mensaje!!!',payload);
        io.emit('mensaje',{admin:payload});
    });

    /* client.on('emitir-mensajes',(payload)=>{
        console.log(payload);
        //io.emit('nuevo-mensaje',payload);//emite a todos los clientes conectados
        client.broadcast.emit('nuevo-mensaje',payload);//emite a todos los clientes conectados menos al que lo emitio
    }) */
    client.on('vote-band',(payload)=>{
        console.log(payload.id);
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });
    client.on('add-band',(payload)=>{
        const newBand=new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands',bands.getBands());
    });
    client.on('delete-band',(payload)=>{
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

});

