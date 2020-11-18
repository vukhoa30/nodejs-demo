import { Request, Response } from 'express';
import { getClubs, getClub, upsertClub, deleteClub } from '../services/index';
import { PER_PAGE } from '../configs/env';

const getClubsController = async (req: any, res: Response) => {
  let {
    name: clubName,
    code: clubCode,
    page
  } = req.query;
  page = Number(page) || 1
  const offset = (page - 1) * PER_PAGE;
  const rslt = await getClubs(clubName, clubCode, offset, PER_PAGE);
  res.json({
    per_page: PER_PAGE,
    page,
    total_page: Math.ceil(rslt.total / PER_PAGE),
    result_count: rslt.rows.length,
    data: rslt.rows
  });
}

const getClubController = async (req: any, res: Response) => {
  const clubId = req.params.id;
  const rslt = await getClub(clubId);
  if (rslt) {
    res.json(rslt);
  } else {
    res.status(404).end();
  }
}

const addClubController = async (req: any, res: Response) => {
  const { country, name, code } = req.body;
  if (!country || !name || !code) {
    return res.status(400)
  }
  const rslt = await upsertClub({ country: { name: country }, name, code });
  if (rslt) {
    res.json(rslt);
  } else {
    return res.status(400).end('Error adding new club. Probably the data already exists.')
  }
}

const updateClubController = async (req: any, res: Response) => {
  let { country, name, code } = req.body;
  const id = req.params.id;
  let modifier: any = { name, code };
  if (country) {
    modifier.country = { name: country };
  }
  const rslt = await upsertClub(modifier, id);
  if (rslt) {
    res.json(rslt);
  } else {
    return res.status(400).end('Error updating club. Probably the data already exists.')
  }
}

const deleteClubController = async (req: any, res: Response) => {
  const id = req.params.id;
  const rslt = await deleteClub(id);
  if (rslt) {
    res.json(rslt);
  } else {
    return res.status(404).end()
  }
}

export {
  getClubsController,
  getClubController,
  addClubController,
  updateClubController,
  deleteClubController
};