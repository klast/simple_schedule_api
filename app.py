from flask import Flask, request
from selenium import webdriver

app = Flask(__name__)


@app.route('/')
def hello_world():
    p_building = request.args.get('building')
    p_floor = request.args.get('floor')
    p_audience = request.args.get('audience')
    chromedriver = r'C:\Users\Vova\Documents\chromedriver\chromedriver.exe'
    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    browser = webdriver.Chrome(executable_path=chromedriver, chrome_options=options)

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
    result = browser.page_source
    return result


if __name__ == '__main__':
    app.run()
