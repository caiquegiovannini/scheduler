const { format } = require('date-fns');
const knex = require('../database');

module.exports = {
  async index(req, res) {
    try {
      const { day } = req.query;

      let results = await knex('appointments')
        .where('cancealed_at', null);

      if (day) {
        results = results.filter(appointment => format(appointment.date, 'yyyy-MM-dd') === day);
      }

      return res.json(results);

    } catch (error) {
      console.error(error);
    }
  },
  async create(req, res) {
    try {
      const {
        client_id,
        choosenDate,
        hour,
        minutes,
        duration
      } = req.body;

      const date = new Date(`${choosenDate} ${hour}:${minutes}`);

      await knex('appointments').insert({
        date,
        client_id,
        duration
      });

      return res.status(201).send();

    } catch (error) {
      console.error(error);
    }
  },
  async update(req, res) {
    try {
      const { appointmentId } = req.params;
      const { choosenDate, hour, minutes, client_id, duration } = req.body;

      const date = new Date(`${choosenDate} ${hour}:${minutes}`);

      await knex('appointments')
        .update({
          date,
          client_id,
          duration
        })
        .where({ id: appointmentId });

      res.send();
    } catch (error) {
      console.error(error);
    }
  },
  async delete(req, res) {
    try {
      const { appointmentId } = req.params;

      await knex('appointments')
        .where({ id: appointmentId })
        .update('cancealed_at', new Date());

        return res.send();

    } catch (error) {
      console.error(error);
    }
  }
}