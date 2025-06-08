import { type SchemaTypeDefinition, defineType, defineField } from 'sanity'
import { product } from './product'
import { category } from './category'
import { subcategory } from './subcategory'
import { atcClassification } from './atcClassification'
import { medicalProfessional } from './medicalProfessional'
import { prescription } from './prescription'
import { drugInteraction } from './drugInteraction'
import { dosageCalculation } from './dosageCalculation'
import { customer } from './customer'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Product Categories
    category,
    subcategory,
    atcClassification,
    
    // Products
    product,
    
    // Pharmacy Specific
    drugInteraction,
    dosageCalculation,
    
    // Customers
    customer,
    
    // Medical Professionals & Prescriptions
    medicalProfessional,
    prescription,
  ],
}
