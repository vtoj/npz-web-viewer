import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Extract the file from the form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Forward the file to the FastAPI backend
    const backendFormData = new FormData()
    backendFormData.append('file', file, file.name)

    const response = await fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: backendFormData,
    })

    const result = await response.json()

    if (!response.ok) {
      // Forward error from FastAPI backend to the client
      return NextResponse.json({ error: result.detail }, { status: response.status })
    }

    // Return success response
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

