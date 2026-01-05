# 🤖 Google AI Studio - Prompt Testing Guide for Retail Bandhu

**Purpose**: Design and test AI features before coding them  
**Tool**: Google AI Studio (https://aistudio.google.com)  
**Date**: December 29, 2024

---

## 📋 **TABLE OF CONTENTS**

1. [Getting Started with AI Studio](#getting-started)
2. [Retail Bandhu AI Use Cases](#use-cases)
3. [Ready-to-Test Prompts](#prompts)
4. [Voice Billing Prompts](#voice-billing)
5. [Inventory Management Prompts](#inventory)
6. [Customer Support Prompts](#support)
7. [Analytics & Insights Prompts](#analytics)
8. [Hinglish Language Prompts](#hinglish)
9. [How to Export to Code](#export)
10. [Testing Checklist](#checklist)

---

## 🚀 **GETTING STARTED WITH AI STUDIO** {#getting-started}

### **Step 1: Access AI Studio**
1. Go to: https://aistudio.google.com
2. Sign in with Google account
3. Click **"Create new prompt"**

### **Step 2: Choose Model**
- **Recommended**: `Gemini 1.5 Pro` (best for complex tasks)
- **Alternative**: `Gemini 1.5 Flash` (faster, cheaper)
- **For Voice**: `Gemini 1.5 Pro` (better multilingual)

### **Step 3: Prompt Types**
- **Freeform Prompt** - For single interactions
- **Structured Prompt** - For consistent outputs
- **Chat Prompt** - For conversations

### **Step 4: Test Settings**
```
Temperature: 0.7 (balanced creativity)
Top P: 0.95 (response diversity)
Top K: 40 (vocabulary range)
Max Output Tokens: 2048
```

---

## 💡 **RETAIL BANDHU AI USE CASES** {#use-cases}

### **1. Voice Billing Assistant** 🎤
- Convert Hinglish voice to bill items
- Handle Indian product names
- Understand quantities (dozen, kg, packet)
- Price suggestions

### **2. Smart Inventory Manager** 📦
- Predict stock needs
- Low stock alerts
- Expiry date tracking
- Reorder suggestions

### **3. Customer Support Chatbot** 💬
- Answer store policies
- Help with billing
- Product information
- Complaint handling

### **4. Analytics & Insights** 📊
- Sales trends
- Best selling items
- Profit analysis
- Customer insights

### **5. Hinglish Understanding** 🇮🇳
- Mix of Hindi + English
- Indian product names
- Regional variations
- Cultural context

---

## 🎯 **READY-TO-TEST PROMPTS** {#prompts}

Copy these prompts into Google AI Studio and test them!

---

## 🎤 **VOICE BILLING PROMPTS** {#voice-billing}

### **Prompt 1: Voice Command to Bill Items**

```
You are a billing assistant for Indian kirana stores. Convert voice commands into structured bill items.

CONTEXT:
- Store: Small retail shop in India
- Language: Hinglish (mix of Hindi and English)
- Common products: Maggi, Parle-G, Pepsi, Tata Tea, oil, rice, biscuits, etc.
- Quantities: pieces, packets, kg, liters, dozen

TASK:
Convert the voice input into a JSON array of bill items with:
- productName (in English)
- quantity (number)
- unit (pieces/kg/liters/packets)
- estimatedPrice (if you can guess based on Indian market prices)

VOICE INPUT:
"Bhaiya 2 packet Maggi aur ek Pepsi bottle dena. Aur haan, 1 kg chini bhi chahiye."

OUTPUT FORMAT:
```json
{
  "items": [
    {
      "productName": "Maggi",
      "quantity": 2,
      "unit": "packets",
      "estimatedPrice": 24,
      "confidence": "high"
    },
    {
      "productName": "Pepsi Bottle",
      "quantity": 1,
      "unit": "pieces",
      "estimatedPrice": 40,
      "confidence": "medium"
    },
    {
      "productName": "Sugar",
      "quantity": 1,
      "unit": "kg",
      "estimatedPrice": 50,
      "confidence": "high"
    }
  ],
  "totalEstimate": 114,
  "originalLanguage": "Hinglish",
  "clarificationNeeded": []
}
```

Now process this voice input:
"[YOUR TEST INPUT HERE]"
```

**Test with these inputs:**
1. `"Teen packet Parle-G, do Coke aur paanch rupay wala nahi, dus rupay wala dena"`
2. `"Ek dozen ande, half kg dhaniya aur 2 liter milk pack kar do"`
3. `"Bhaiya teen Dairy Milk chocolate, ek Kurkure aur do Frooti dena"`

---

### **Prompt 2: Voice Confirmation (Text-to-Speech)**

```
You are a friendly kirana store assistant. Generate natural Hinglish responses to confirm what the customer ordered.

RULES:
1. Be warm and friendly (use "Bhaiya/Didi" appropriately)
2. Mix Hindi and English naturally
3. Confirm each item clearly
4. State total amount
5. Ask for confirmation

BILL ITEMS:
- 2x Maggi packets @ ₹12 each
- 1x Pepsi 500ml @ ₹40
- 1kg Sugar @ ₹50

Generate a natural confirmation message that I can use for Text-to-Speech.

GOOD EXAMPLE:
"Ji bhaiya, aapka order confirm kar loon? 2 packet Maggi Rs. 24, ek Pepsi Rs. 40, aur ek kilo chini Rs. 50. Total Rs. 114 ban raha hai. Theek hai?"

Now generate for this bill:
[PASTE YOUR BILL HERE]
```

---

### **Prompt 3: Handle Unclear Voice Input**

```
You are helping a kirana store owner understand unclear voice commands.

TASK: Identify what's unclear and suggest clarifying questions in Hinglish.

VOICE INPUT:
"Bhaiya woh laal wala packet dena... haan wahi... teen packet"

IDENTIFY:
1. What's unclear?
2. What questions should be asked?
3. Possible products matching "laal wala packet"

OUTPUT:
```json
{
  "unclear": ["Product name not specific - 'laal wala packet'"],
  "possibleProducts": [
    "Maggi (red packet)",
    "Kurkure (red variety)",
    "Lays Red Chilli"
  ],
  "clarifyingQuestion": "Bhaiya, aap Maggi chahiye ya Kurkure? Ya koi aur laal packet?",
  "confidence": "low"
}
```

Test with:
"[YOUR UNCLEAR INPUT]"
```

---

## 📦 **INVENTORY MANAGEMENT PROMPTS** {#inventory}

### **Prompt 4: Smart Reorder Suggestions**

```
You are an inventory management AI for Indian kirana stores.

CURRENT INVENTORY:
```json
{
  "products": [
    {"name": "Maggi", "currentStock": 5, "avgDailySales": 10, "daysUntilExpiry": 180},
    {"name": "Pepsi 250ml", "currentStock": 8, "avgDailySales": 15, "daysUntilExpiry": 90},
    {"name": "Parle-G", "currentStock": 25, "avgDailySales": 12, "daysUntilExpiry": 120},
    {"name": "Tata Tea", "currentStock": 3, "avgDailySales": 2, "daysUntilExpiry": 365}
  ]
}
```

TASK:
Analyze this inventory and suggest:
1. Which items to reorder urgently
2. Recommended order quantity
3. Priority level
4. Reasoning in simple Hinglish

OUTPUT FORMAT:
```json
{
  "urgentReorders": [
    {
      "product": "Maggi",
      "currentStock": 5,
      "daysLeft": 0.5,
      "recommendedOrder": 50,
      "priority": "URGENT",
      "reasoning": "Stock kam hai, daily 10 packet bikti hai, sirf aadha din ka stock bacha hai",
      "message": "⚠️ Maggi urgent mangwao! Kal tak stock khatam ho jayega"
    }
  ],
  "normalReorders": [],
  "wellStocked": []
}
```

Now analyze:
[YOUR INVENTORY DATA]
```

---

### **Prompt 5: Expiry Alert System**

```
Generate friendly Hinglish alerts for products nearing expiry.

PRODUCTS NEAR EXPIRY:
- Bread (expires in 2 days, 5 pieces left)
- Milk packets (expires in 1 day, 3 liters left)
- Frooti (expires in 7 days, 20 pieces left)

Generate:
1. WhatsApp message to send customers
2. In-store discount announcement
3. Staff action items

TONE: Friendly, urgent but not alarming, promotional
```

---

## 💬 **CUSTOMER SUPPORT PROMPTS** {#support}

### **Prompt 6: Kirana Store Chatbot**

```
You are "Bandhu" - a friendly AI assistant for Retail Bandhu, a kirana store app.

PERSONALITY:
- Warm and helpful (like a neighborhood shopkeeper)
- Speaks Hinglish naturally
- Uses emojis appropriately
- Patient and understanding

CAPABILITIES:
- Answer billing questions
- Help find products
- Explain app features
- Handle complaints politely
- Suggest products

EXAMPLE CONVERSATION:
Customer: "Bhaiya, bill kaise banate hain?"
Bandhu: "Bilkul simple hai! 🎤 Voice button dabao aur bolo 'do Maggi, ek Pepsi' - bas! Bill ban jayega. Ya phir manually bhi add kar sakte ho. Kya try karein?"

Now respond to:
Customer: "[YOUR CUSTOMER QUESTION]"
```

**Test with:**
1. `"Mera last month ka total sales kya hai?"`
2. `"WhatsApp pe bill kaise bhejun?"`
3. `"Stock kam hai to alert kaise aayega?"`
4. `"App Hindi mein kaise chalega?"`

---

### **Prompt 7: Complaint Handling**

```
You are handling customer complaints for a kirana store.

COMPLAINT:
"Bhaiya, kal jo Maggi liya tha woh kharab nikla. Paisa wapas chahiye."

TASK:
Generate a polite response that:
1. Acknowledges the issue
2. Apologizes sincerely
3. Offers solution
4. Maintains customer relationship

TONE: Empathetic, professional, solution-focused, Hinglish
```

---

## 📊 **ANALYTICS & INSIGHTS PROMPTS** {#analytics}

### **Prompt 8: Sales Insights Generator**

```
You are a business analyst for Indian kirana stores. Analyze sales data and provide insights in simple Hinglish.

SALES DATA (Last 7 days):
```json
{
  "totalSales": 15000,
  "totalBills": 145,
  "topProducts": [
    {"name": "Parle-G", "quantity": 85, "revenue": 425},
    {"name": "Maggi", "quantity": 72, "revenue": 864},
    {"name": "Pepsi", "quantity": 65, "revenue": 1300}
  ],
  "peakHours": ["9-10 AM", "6-8 PM"],
  "slowDays": ["Tuesday", "Wednesday"]
}
```

TASK:
Generate a friendly daily report with:
1. Summary in 2-3 lines (Hinglish)
2. Key insights
3. Action items
4. Motivational message

EXAMPLE OUTPUT:
"📊 **Aaj ka Report**

Boss, is hafte kaafi achha raha! Total ₹15,000 ki sales hui, 145 bills bane. 

**Top 3 Items:**
🍪 Parle-G - 85 packets (sabse zyada bikne wala!)
🍜 Maggi - 72 packets  
🥤 Pepsi - 65 bottles

**Smart Insights:**
- Shaam 6-8 baje sabse zyada customers aate hain - is time pe extra stock rakho
- Mangalwar aur Budhwar slow rehta hai - tab offers de sakte ho
- Parle-G bohot achha chal raha hai, stock badhao

**Kal ka Target:** ₹2,500 🎯

Keep it up! 💪"

Now generate report for:
[YOUR SALES DATA]
```

---

### **Prompt 9: Profit Margin Analysis**

```
Analyze profit margins and suggest pricing improvements.

PRODUCTS:
```json
[
  {"name": "Maggi", "costPrice": 10, "sellingPrice": 12, "monthlySales": 300},
  {"name": "Pepsi 250ml", "costPrice": 35, "sellingPrice": 40, "monthlySales": 200},
  {"name": "Parle-G", "costPrice": 4, "sellingPrice": 5, "monthlySales": 400}
]
```

TASK:
1. Calculate profit margin for each
2. Identify low-margin items
3. Suggest price adjustments (considering competition)
4. Explain in simple Hinglish

OUTPUT: Simple actionable advice for shopkeeper
```

---

## 🇮🇳 **HINGLISH LANGUAGE PROMPTS** {#hinglish}

### **Prompt 10: Hinglish Translation Engine**

```
You are a Hinglish translator for kirana stores.

RULES:
1. Keep commonly used Hindi words (dena, chahiye, bhaiya)
2. Use English for product names and numbers
3. Sound natural, like real conversation
4. Match the formality level

TRANSLATE THESE:
1. "Please add 2 Maggi packets to the bill"
   → "Bhaiya, bill mein 2 Maggi packets add kar do"

2. "Your total is ₹125. Would you like to pay by cash or UPI?"
   → "[YOUR TRANSLATION]"

3. "Low stock alert: Only 5 pieces of Pepsi remaining"
   → "[YOUR TRANSLATION]"

4. "Thank you for shopping! Visit again"
   → "[YOUR TRANSLATION]"

Now translate:
"[YOUR ENGLISH TEXT]"
```

---

### **Prompt 11: Regional Variations**

```
Adapt Hinglish for different Indian regions.

BASE TEXT:
"Bhaiya, aapka bill ready hai. Total ₹500 hai. Cash doge ya UPI?"

ADAPT FOR:
1. **Delhi style**: [Casual, use 'yaar', quick]
2. **Mumbai style**: [Use 'boss', 'ekdum', energetic]
3. **South India**: [More English, polite, formal]
4. **Rural area**: [Simple Hindi, less English]

Generate all 4 variations maintaining the same meaning.
```

---

## 💻 **HOW TO EXPORT TO CODE** {#export}

### **Step 1: Get API Key**
1. In AI Studio, click **"Get API Key"**
2. Create new key for your project
3. Copy the key (starts with `AIza...`)

### **Step 2: Test Your Prompt**
- Refine until you get consistent results
- Test with 10+ examples
- Note temperature and settings

### **Step 3: Export Code**
AI Studio provides code snippets in:
- Python
- JavaScript/Node.js
- cURL
- REST API

### **Step 4: Integrate in Retail Bandhu**

**Example for Voice Billing:**

```typescript
// /utils/geminiAI.ts

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

export async function processVoiceBilling(voiceInput: string) {
  const prompt = `
You are a billing assistant for Indian kirana stores...
[YOUR TESTED PROMPT FROM AI STUDIO]

VOICE INPUT: "${voiceInput}"
`;

  const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    })
  });

  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}
```

---

## ✅ **TESTING CHECKLIST** {#checklist}

### **Before Coding:**
- [ ] Tested prompt with 10+ examples
- [ ] Consistent output format
- [ ] Handles edge cases
- [ ] Works in Hinglish
- [ ] Response time acceptable
- [ ] Cost estimated (tokens used)

### **Prompt Quality:**
- [ ] Clear instructions
- [ ] Good examples provided
- [ ] Output format specified
- [ ] Error handling considered
- [ ] Cultural context included

### **For Voice Features:**
- [ ] Handles common mispronunciations
- [ ] Works with Hindi product names
- [ ] Understands quantities
- [ ] Returns structured data

### **For Chat Features:**
- [ ] Maintains personality
- [ ] Stays on topic
- [ ] Handles follow-ups
- [ ] Polite and helpful

---

## 🎯 **TESTING WORKFLOW**

```
1. CREATE PROMPT in AI Studio
   ↓
2. TEST with sample inputs
   ↓
3. REFINE based on results
   ↓
4. TEST with edge cases
   ↓
5. DOCUMENT settings used
   ↓
6. EXPORT code snippet
   ↓
7. INTEGRATE in Retail Bandhu
   ↓
8. TEST in real app
   ↓
9. MONITOR usage & costs
   ↓
10. ITERATE based on feedback
```

---

## 📝 **SAMPLE TEST CASES**

### **Voice Billing Test Cases:**
```
✅ PASS: "Do Maggi aur ek Pepsi"
✅ PASS: "Teen packet biscuit chahiye"
✅ PASS: "Bhaiya 5 rupay wala Parle-G do packet"
❌ FAIL: "Woh laal wala" (too vague)
❌ FAIL: "Sab kuch de do" (not specific)
⚠️  CLARIFY: "Maggi ya Yippee?" (needs choice)
```

### **Expected Edge Cases:**
- Multiple items in one sentence
- Items with similar names
- Regional product variations
- Quantity confusion (2 vs dozen)
- Price mentioned vs quantity

---

## 💰 **COST ESTIMATION**

### **Gemini Pricing (as of Dec 2024):**
- **Input**: $0.00025 per 1K characters
- **Output**: $0.0005 per 1K characters

### **Example Costs:**
- Voice billing (500 chars): ~$0.0005 per request
- Chat message (300 chars): ~$0.0003 per message
- Daily analytics (1000 chars): ~$0.001 per report

**For small kirana:** ~₹50-100/month even with heavy usage

---

## 🚀 **NEXT STEPS**

### **1. Start Testing** (Today)
- Go to https://aistudio.google.com
- Copy Prompt 1 (Voice Billing)
- Test with your own examples
- Refine until perfect

### **2. Document Results** (This Week)
- Save successful prompts
- Note settings used
- List edge cases found
- Plan integration points

### **3. Get API Key** (When Ready)
- Create project in Google Cloud
- Enable Gemini API
- Get API key
- Add to Retail Bandhu

### **4. Code Integration** (Next Sprint)
- Start with one feature
- Test thoroughly
- Monitor costs
- Gather user feedback

---

## 🎓 **LEARNING RESOURCES**

### **Google AI Studio:**
- Tutorial: https://ai.google.dev/tutorials
- Prompt Guide: https://ai.google.dev/docs/prompt_best_practices
- API Docs: https://ai.google.dev/api

### **Best Practices:**
- Be specific in instructions
- Provide good examples
- Test extensively
- Use system instructions
- Monitor token usage

---

## 🎉 **CONCLUSION**

You now have:
✅ 11 ready-to-test prompts  
✅ Complete testing workflow  
✅ Integration guidance  
✅ Cost estimates  
✅ Best practices  

**START HERE:**
1. Open https://aistudio.google.com
2. Copy "Prompt 1: Voice Command to Bill Items"
3. Test with your kirana scenarios
4. Refine until perfect
5. Save for coding later

**Happy Testing!** 🚀

---

**Document Version**: 1.0  
**Created**: December 29, 2024  
**For**: Retail Bandhu Lite - AI Feature Design
