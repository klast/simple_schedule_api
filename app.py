from flask import Flask, request
from selenium import webdriver

GOOGLE_CHROME_PATH = '/app/.apt/usr/bin/google-chrome'
CHROMEDRIVER_PATH = '/app/.chromedriver/bin/chromedriver'

app = Flask(__name__)


@app.route('/')
def hello_world():
    p_building = request.args.get('building')
    p_floor = request.args.get('floor')
    p_audience = request.args.get('audience')
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.binary_location = GOOGLE_CHROME_PATH
    chrome_options.add_argument('headless')
    browser = webdriver.Chrome(executable_path=CHROMEDRIVER_PATH, chrome_options=chrome_options)
    browser.get('https://lk.ugatu.su/audience')
    building = browser.find_element_by_id('id_building')
    building.send_keys(p_building)
    floor = browser.find_element_by_id('id_floor')
    floor.send_keys(p_floor)
    audit = browser.find_element_by_id('id_audience')
    audit.send_keys(p_audience)
    tmp = browser.find_element_by_xpath("//ul[@id='id_ScheduleType']/li[3]")
    tmp.click()
    but = browser.find_element_by_name('view')
    but.click()
    result = browser.page_source.copy()
    browser.close()
    return result


if __name__ == '__main__':
    app.run()
