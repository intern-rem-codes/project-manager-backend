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
    } = req.body as {
      firstName?: unknown;
      lastName?: unknown;
      email?: unknown;
      phone?: unknown;
      dateOfBirth?: unknown;
      street?: unknown;
      city?: unknown;
      postalCode?: unknown;
      country?: unknown;
    };

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Ongeldige client id" });
    }
    if (typeof firstName !== "string" || !firstName.trim()) {
      return res.status(400).json({ message: "Voornaam is verplicht" });
    }
    if (typeof lastName !== "string") {
      return res.status(400).json({ message: "Achternaam is verplicht" });
    }
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: "E-mailadres is verplicht" });
    }

    const phoneValue = typeof phone === "string" && phone.trim() ? phone.trim() : null;
    const streetValue = typeof street === "string" && street.trim() ? street.trim() : null;
    const cityValue = typeof city === "string" && city.trim() ? city.trim() : null;
    const postalCodeValue =
      typeof postalCode === "string" && postalCode.trim() ? postalCode.trim() : null;
    const countryValue = typeof country === "string" && country.trim() ? country.trim() : null;

    let dobValue: Date | null = null;
    if (dateOfBirth === null || dateOfBirth === undefined || dateOfBirth === "") {
      dobValue = null;
    } else if (typeof dateOfBirth === "string") {
      const parsed = new Date(dateOfBirth);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ message: "Ongeldige geboortedatum" });
      }
      dobValue = parsed;
    } else {
      return res.status(400).json({ message: "Ongeldige geboortedatum" });
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phoneValue,
        dateOfBirth: dobValue,
        street: streetValue,
        city: cityValue,
        postalCode: postalCodeValue,
        country: countryValue,
      },
    });

    res.json(updatedClient);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === "P2002"
    ) {
      return res.status(409).json({ message: "E-mailadres is al in gebruik" });
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === "P2025"
    ) {
      return res.status(404).json({ message: "Client niet gevonden" });
    }
    console.error(error);
    res.status(500).json({ message: "Fout bij updaten client" });
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
