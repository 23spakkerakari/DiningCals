const NUTRITIONIX_API_KEY = "debb25730dd00f331e0714fab96d4dde"
const NUTRIOTIONIX_APP_ID = "16277419"

/** A tooltip element responsible for housing our nutrition info
 * A small pop-up that's activated when user hovers. Styling elements below
 */
const tooltip = document.createElement('div');
tooltip.style.cssText = `
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px; 
    padding: 8px; 
    display: none; 
    max-width: 200px;
    font-size: 11px;
`

document.body.appendChild(tooltip);

//Let's now create a cache for our nutrition data
const nutritionCache = new Map();

async function getNutritionInfo(foodItem){
    //first, we wil check our cache to see if the 
    if (nutritionCache.has(foodItem)){
        return nutritionCache.get(foodItem);
    }

    try{

        //A call to our api
        const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
                'x-app-id': NUTRIOTIONIX_APP_ID,
                'x-app-key': NUTRITIONIX_API_KEY
            },
            body: JSON.stringify({
                query: foodItem, 
                timezone: "US/Eastern"
            })
        });

        const data = await response.json();
        if( !data.foods || !data.foods[0]){
            throw new Error('Request came back empty!');
        }

        const nutrition = {
            calories: Math.round(data.foods[0].nf_calories),
            protein: Math.round(data.foods[0].nf_protein),
            carbs: Math.round(data.foods[0].nf_total_carbohydrates),
            fat: Math.round(data.foods[0].nf_total_fat),
            serving_size: Math.round(data.foods[0].serving_qty), 
            serving_unit: Math.round(data.foods[0].serving_unit)        
        }

        nutritionCache.set(foodItem, nutrition)
        return nutrition;

    }catch (error){
        console.error("There was an error: ", error);
        return null;
    }
}

function formatNutritionInfo(nutrition){
    if(!nutrition){
        console.error("Nutrition is none for some reason");
        return null;
    }

    return `
        Serving: ${nutrition.serving_size} ${nutrition.serving_unit}
        Calories: ${nutrition.calories}
        Protein: ${nutrition.protein}g
        Carbs: ${nutrition.carbs}g
        Fat: ${nutrition.fat}g
    `.trim.replace(/\n\s+/g, '<br>')
}

function showToolTip(event, content){
    tooltip.innerHTML = content;
    tooltip.style.display = "block";

    //now let's position our tooltip near our cursor
    const x = event.pageX + 10;
    const y = event.pageY + 10;

    const toolTipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight; 

    if (x + tooltipRect.width > viewportWidth) {
        tooltip.style.left = (x - tooltipRect.width - 10) + 'px';
    } else {
        tooltip.style.left = x + 'px';
    }
    
    if (y + tooltipRect.height > viewportHeight) {
        tooltip.style.top = (y - tooltipRect.height - 10) + 'px';
    } else {
        tooltip.style.top = y + 'px';
    }

}

function hideToolTip(){
    tooltip.style.display = 'none';
}

function initNutritionTooltips(){

    //Update these selectors based on Cornell's actual HTML structure
    const menuItems = document.querySelectorAll('.accordion-content');

    menuItems.forEach(section => {

        const foodString = section.textContent.trim();
        const foodItems = foodString.split(" • ");

        foodItems.forEach(foodItem => {
            const span = document.createElement('span');
            span.textContent = foodItem.trim();
            span.style.cursor = 'pointer';
            section.appendChild(span);

            span.addEventListener('mouseenter', async (event) => {                
                // Show loading state
                showTooltip(event, 'Loading nutrition info...');
                
                // Fetch nutrition info
                const nutrition = await getNutritionInfo(foodItem.trim());
                
                // Update tooltip with nutrition info
                if (span.matches(':hover')) { // Only update if still hovering
                    showTooltip(event, formatNutritionInfo(nutrition));
                }
            });
        });

        span.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
}

document.addEventListener('DOMContentLoaded', initNutritionTooltips);

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            initNutritionTooltips();
        }
    })
});

observer.observe(document.body, {
    childList: true, 
    subtree: true
})