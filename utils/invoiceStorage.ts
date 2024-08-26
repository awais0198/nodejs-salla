import fs from 'fs'

import { IInvoice } from '../models/invoice'
import { DATABASE_FILE_PATH } from '../constants'

function loadInvoices(): IInvoice[] {
  if (!fs.existsSync(DATABASE_FILE_PATH)) {
    return []
  }
  const data = fs.readFileSync(DATABASE_FILE_PATH, 'utf-8')
  return JSON.parse(data)
}

function saveInvoices(invoices: IInvoice[]) {
  fs.writeFileSync(DATABASE_FILE_PATH, JSON.stringify(invoices, null, 2))
}

export function saveInvoice(invoice: IInvoice) {
  const invoices = loadInvoices()
  invoices.push(invoice)
  saveInvoices(invoices)
}

export function getInvoiceById(id: string): IInvoice | undefined {
  const invoices = loadInvoices()
  return invoices.find(invoice => invoice.id === id)
}

export function getAllInvoices(): IInvoice[] {
  return loadInvoices()
}
