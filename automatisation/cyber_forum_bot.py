#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import datetime
import random
import string

KEYWORDS = ['vulnerability', 'CVE', 'ransomware', 'zero-day', 'malware', 'breach', 'exploit', 'phishing', 'backdoor', 'critical', 'ia', 'claude', 'google']
API_URL = "http://localhost:3001"
BOT_USER = "Captain Hook"

def generate_id():
    return f"{int(datetime.datetime.now().timestamp() * 1000)}-{''.join(random.choices(string.ascii_lowercase + string.digits, k=9))}"

def scrape_thehackernews():
    url = "https://thehackernews.com/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(response.text, 'html.parser')
    articles = []
    for item in soup.find_all('div', class_='body-post')[:10]:
        title_tag = item.find('h2', class_='home-title')
        link_tag = item.find('a', class_='story-link')
        desc_tag = item.find('div', class_='home-desc')
        if title_tag and link_tag:
            articles.append({
                'title': title_tag.get_text(strip=True),
                'link': link_tag.get('href', ''),
                'desc': desc_tag.get_text(strip=True) if desc_tag else ''
            })
    return articles

def filter_by_keywords(articles):
    filtered = []
    for article in articles:
        text = (article['title'] + ' ' + article['desc']).lower()
        matched = [kw for kw in KEYWORDS if kw.lower() in text]
        if matched:
            article['keywords'] = matched
            filtered.append(article)
    return filtered

def get_messages():
    response = requests.get(f"{API_URL}/messages")
    data = response.json()
    return data.get('messages', [])

def post_articles(articles):
    messages = get_messages()
    existing_titles = [m['contenu'].split('\n')[0] for m in messages if m['auteur'] == BOT_USER]
    new_posts = 0
    for article in articles:
        title_line = f"{article['title']}"
        if title_line in existing_titles:
            continue
        contenu = f"{article['title']}\n\n{article['desc']}\n\nmots-clés : {', '.join(article['keywords'])}\nlien : {article['link']}"
        new_message = {
            "id": generate_id(),
            "auteur": BOT_USER,
            "createdAt": datetime.datetime.now().isoformat(),
            "contenu": contenu,
            "reponses": [],
            "likes": []
        }
        messages.insert(0, new_message)
        new_posts += 1
    if new_posts > 0:
        requests.put(f"{API_URL}/messages", json={"messages": messages}, headers={"Content-Type": "application/json"})
        print(f"{new_posts} nouveaux posts publiés sur le forum !")
    else:
        print("Aucun nouveau article à publier.")

def main():
    print("Scraping The Hacker News...")
    articles = scrape_thehackernews()
    filtered = filter_by_keywords(articles)
    print(f"{len(filtered)} articles cyber détectés")
    post_articles(filtered)

if __name__ == "__main__":
    main()
