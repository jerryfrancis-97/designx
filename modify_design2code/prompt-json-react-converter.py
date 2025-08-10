import json
import google.generativeai as genai

# --- SETUP ---
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load design JSON
with open("design-components_1.json", "r") as f:
    design_json = json.load(f)

# Create the prompt for Gemini
prompt = f"""
You are a code generator. 
Convert the following JSON, which describes UI components, into a complete functional React component in JSX. 
Preserve the absolute positioning, sizes, colors, and any content.
Return only the JSX code inside a React functional component.

JSON:
{json.dumps(design_json, indent=2)}
"""


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
response = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)

# Extract the generated code
jsx_code = response.text

# Save to file
with open("modify_design2code/GeneratedUI.jsx", "w") as f:
    f.write(jsx_code)

print("✅ React UI generated and saved to GeneratedUI.jsx")
