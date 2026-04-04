export interface ToolDef {
    name: string,
    description: string,
    jsonSchema: string,
    creator: string,
    createdAt: Date,
    updatedAt: Date
}

export interface CreateToolDef {
    name: string,
    description: string,
    jsonSchema: string,
    creator: string
}

export interface UpdateToolDef {
    description: string,
    jsonSchema: string,
}