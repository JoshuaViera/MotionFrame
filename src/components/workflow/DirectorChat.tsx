// Error Handling Layer (The Jensen Shield) 
if (!prompt.isValid) {
  return NextResponse.json({ 
    success: false, 
    error: 'invalid_prompt', 
    message: 'The Creative Director needs more detail to avoid noise.' 
  });
}
