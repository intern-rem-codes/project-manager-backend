import { Request, Response } from "express";
import prisma from "../prisma";
import { CreateClientDTO, UpdateClientDTO } from "../interfaces/client";

export const createClient = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      street,
      city,
      postalCode,
      country,
    } = req.body;

    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        street,
        city,
        postalCode,
        country,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: "Fout bij aanmaken client" });
  }
};
export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Fout bij ophalen clients" });
  }
};
export const getClientById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      return res.status(404).json({ error: "Client niet gevonden" });
    }

    return res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: "Fout bij ophalen client" });
  }
};
export const updateClient = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const updatedClient = await prisma.client.update({
      where: { id },
      data: req.body,
    });

    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: "Fout bij updaten client" });
  }
};
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existingProjects = await prisma.project.findMany({
      where: {
        clientId: id,
      },
    });

    if (existingProjects.length > 0) {
      return res.status(400).json({
        error:
          "Client kan niet worden verwijderd omdat er projecten aan gekoppeld zijn.",
      });
    }
    await prisma.client.delete({
      where: { id },
    });

    res.json({ message: "Client verwijderd" });
  } catch (error) {
    res.status(500).json({ error: "Fout bij verwijderen client" });
  }
};
