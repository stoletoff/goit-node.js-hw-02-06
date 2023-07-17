import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export const contactsPath = path.resolve("models", "contacts.json");
const updateContactStorage = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (id) => {
  const data = await listContacts();
  const result = data.find((contact) => contact.id === id);
  return result || null;
};

const removeContact = async (id) => {
  const data = await listContacts();
  const indexOfContact = data.findIndex((contact) => contact.id === id);
  if (indexOfContact === -1) {
    return null;
  }
  const [result] = data.splice(indexOfContact, 1);
  await updateContactStorage(data);
  return result;
};

const addContact = async ({ name, email, phone }) => {
  const data = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  data.push(newContact);
  await updateContactStorage(data);
  return newContact;
};

const updateContactByID = async (id, { name, email, phone }) => {
  const data = await listContacts();
  const index = data.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  data[index] = { id, name, email, phone };
  await updateContactStorage(data);
  return data;
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactByID,
};
