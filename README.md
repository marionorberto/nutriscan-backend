
// API Endpoints
// URL	Verb	Purpose
// /food/{fdcId}	GET	Fetches details for one food item by FDC ID
// /foods	GET | POST	Fetches details for multiple food items using input FDC IDs
// /foods/list	GET | POST	Returns a paged list of foods, in the 'abridged' format
// /foods/search	GET | POST	Returns a list of foods that matched search (query) keywords
// Sample Calls
// Note: These calls use DEMO_KEY for the API key, which can be used for initially exploring the API prior to signing up, but has much lower rate limits. See here for more info on uses and limitations of DEMO_KEY.

// GET REQUEST:
// curl https://api.nal.usda.gov/fdc/v1/food/######?api_key=DEMO_KEY
// The number (######) in the above sample must be a valid FoodData Central ID.

// curl https://api.nal.usda.gov/fdc/v1/foods/list?api_key=DEMO_KEY
// curl https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=Cheddar%20Cheese
// POST REQUEST:
// curl -XPOST -H "Content-Type:application/json" -d '{"pageSize":25}' https://api.nal.usda.gov/fdc/v1/foods/list?api_key=DEMO_KEY
// curl -XPOST -H "Content-Type:application/json" -d '{"query":"Cheddar cheese"}' https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY
// curl -XPOST -H "Content-Type:application/json" -d "{\"query\":\"Cheddar cheese\"}" https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY
// Note: If using curl on Windows, the body of the POST request (-d option) is enclosed in double quotes (as shown in the above sample).

// curl -XPOST -H "Content-Type:application/json" -d '{"query": "Cheddar cheese", "dataType": ["Branded"], "sortBy": "fdcId", "sortOrder": "desc"}' https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY
// Note: The "dataType" parameter values need to be specified as an array.