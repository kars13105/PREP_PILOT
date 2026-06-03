import requests
from bs4 import BeautifulSoup

def scrape_job(url):
    if not url or not url.strip() or not url.startswith("http"):
        print("Scraper warning: Invalid or empty Job URL provided.")
        return ""

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9"
        }

        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )
        response.raise_for_status()

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )
        
        # Remove script and style elements to clean HTML content
        for element in soup(["script", "style", "nav", "footer", "header"]):
            element.extract()

        text = soup.get_text(
            separator=" ",
            strip=True
        )
        
        # Return cleaned text up to 15000 characters
        return text[:15000]
    except Exception as e:
        print(f"Scraper Error scraping {url}: {e}")
        # Return empty string instead of crashing, allowing resume agent to fall back
        return ""