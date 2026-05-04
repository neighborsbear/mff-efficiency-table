window.onload = function () {
    // 여기 안의 코드가 페이지 로드 완료 후 실행됨
    const crystal = document.getElementById("crystal");
    const won = document.getElementById("cash");
    const value = document.querySelector(".value");

    const sBtn = document.querySelector("#menu_btn .s_btn");
    const cBtn = document.querySelector("#menu_btn .c_btn");
    const rBtn = document.querySelector("#menu_btn .r_btn");
    const menuS = document.getElementById("menu_s");
    const menuC = document.getElementById("menu_c");
    const menuR = document.getElementById("menu_r");

    const cmbtn_cash = document.querySelector("#check_menu_btn .cmbtn_cash");
    const cmbtn_crystal = document.querySelector("#check_menu_btn .cmbtn_crystal");
    const check_cash = document.getElementById("check_cash");
    const check_crystal = document.getElementById("check_crystal");

    // 변동 가치
    const em5 = document.getElementById("5em");
    const em6 = document.getElementById("6em");
    const unequip = document.getElementById("unequip");
    const unoru = document.getElementById("unoru");
    const season = document.getElementById("season");
    const t2 = document.getElementById("t2");
    const t4_1 = document.getElementById("t4_1");
    const t4_2 = document.getElementById("t4_2");
    const t4_3 = document.getElementById("t4_3");
    const t4_normal = document.getElementById("t4_normal");
    const t4_advanced = document.getElementById("t4_advanced");
    const t4_premium = document.getElementById("t4_premium");

    // 변동 가치 세트
    const stash = document.getElementById("stash");
    const stashing = document.getElementById("stashing");
    const every = document.getElementById("every");
    const everyx = document.getElementById("everyx");
    const t4_365 = document.getElementById("365tier4");

    // 페이지 처음 들어오면 기본 버튼에 on 클래스 추가
    sBtn.classList.add("on");
    cmbtn_cash.classList.add("on");

    // 메뉴 탭 전환 공통 로직 (중복 제거)
    const menuBtns = [sBtn, cBtn, rBtn];
    menuBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            menuBtns.forEach(b => b.classList.remove("on"));
            this.classList.add("on");
            updateMenu();
        });
    });

    // 체크 버튼 전환 공통 로직 (중복 제거)
    const checkBtns = [cmbtn_cash, cmbtn_crystal];
    checkBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            checkBtns.forEach(b => b.classList.remove("on"));
            this.classList.add("on");
            updateMenu();
            updateTotalCrystal(); // 탭 전환 시 효율 다시 계산
        });
    });

    // [수정] 문자열 절삭 방식을 사용하여 반올림을 완전히 방지한 포맷팅 함수
    function formatResult(num) {
        if (isNaN(num) || num === Infinity || num === -Infinity) return "0";

        // 1. 숫자를 문자열로 변환 (지수 표기법 방지 위해 고정 소수점 사용)
        let str = num.toFixed(20); 
        
        // 2. 소수점 위치 찾기
        const dotIndex = str.indexOf(".");
        if (dotIndex !== -1) {
            // 소수점 자르기 (점 + 소수점 = 13개 문자)
            str = str.substring(0, dotIndex + 13);
        }

        // 3. 뒤에 붙은 불필요한 0 제거 (예: 5.5000 -> 5.5) 및 마침표 제거
        str = parseFloat(str).toString();

        // 4. 천 단위 콤마 추가 (정규식)
        const parts = str.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        return parts.join(".");
    }

    // 알려주신 정규식 방식을 사용하여 .price span 요소들만 변경
    function formatPrice() {
        const prices = document.querySelectorAll(".price span");
        const regex = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;

        prices.forEach(span => {
            let originalText = span.textContent;
            let numPart = originalText.replace(/[^0-9.]/g, "");
            let unitPart = originalText.replace(/[0-9.]/g, "");

            if (numPart !== "") {
                span.textContent = numPart.toString().replace(regex, ",") + unitPart;
            }
        });
    }

    function updateMenu() {
        if (sBtn.classList.contains("on")) {
            menuS.classList.add("on");
        } else {
            menuS.classList.remove("on");
        }

        if (cBtn.classList.contains("on")) {
            menuC.classList.add("on");
        } else {
            menuC.classList.remove("on");
        }

        if (rBtn.classList.contains("on")) {
            menuR.classList.add("on");
        } else {
            menuR.classList.remove("on");
        }

        if (cmbtn_cash.classList.contains("on")) {
            check_cash.classList.add("on");
        } else {
            check_cash.classList.remove("on");
        }

        if (cmbtn_crystal.classList.contains("on")) {
            check_crystal.classList.add("on");
        } else {
            check_crystal.classList.remove("on");
        }
    }

    // [중요] 효율 색상 변경 감지 로직 보강
    function checkEfficiencyClasses() {
        // 개별 아이템들의 효율 박스들뿐만 아니라 하단 합계 효율 박스도 포함
        const efficientBoxes = document.querySelectorAll(".efficient");
        
        efficientBoxes.forEach(box => {
            // .percent(개별) 혹은 .all_percent(합계) 요소를 찾음
            const percentSpan = box.querySelector(".percent, .all_percent");
            if (percentSpan) {
                const val = parseFloat(percentSpan.textContent.replace(/,/g, ""));
                
                if (!isNaN(val) && val >= 100) {
                    box.classList.add("up");
                } else {
                    box.classList.remove("up");
                }
            }
        });
    }

    function updateValue() {
        const crystalValue = Number(crystal.value);
        const wonValue = Number(won.value);

        if (crystalValue === 0) {
            value.textContent = "계산 불가";
            return;
        }

        // 1수정당 가치 계산
        const result = wonValue / crystalValue;
        value.textContent = formatResult(result) + "원";

        // 재료 가치
        // 생데 가치
        const data = 1813 / 930;

        // [추가] 티어-4 재료 패키지 계산 (100% 효율 가정)
        const totalMaterialCrystal = (119000 / result) - 5500;
        const X = totalMaterialCrystal / 122100;
        const t4_item1 = X * 15;
        const t4_item2 = X * 10;
        const t4_item3 = X * 12;

        // #시즌 토큰 계산 30토큰 = 1750수정
        if (season) {
            season.textContent = formatResult(1750 / 30);
        }

        // #t2 계산
        if (t2) {
            t2.textContent = formatResult(data * 167);
        }

        // #em 계산
        if (em5) {
            em5.textContent = formatResult((30000 / result) - 1500);
        }
        if (em6) {
            em6.textContent = formatResult(((30000 / result) - 1500) * 1.7 / 0.4999);
        }

        // #unequip 계산
        if (unequip) {
            unequip.textContent = formatResult((12000 / result) - 100);
        }
        // #unoru 계산
        if (unoru) {
            unoru.textContent = formatResult((12000 / result) - 100);
        }

        // 4티 각 재료별 수정 가치
        if (t4_1) t4_1.textContent = formatResult(t4_item1);
        if (t4_2) t4_2.textContent = formatResult(t4_item2);
        if (t4_3) t4_3.textContent = formatResult(t4_item3);

        // 4티 승급권 계산
        if (t4_normal) {
            t4_normal.textContent = formatResult((t4_item1 * 1000) + (t4_item2 * 800) + (t4_item3 * 1500));
        }
        // 4티 고승권 계산
        if (t4_advanced) {
            t4_advanced.textContent = formatResult((t4_item1 * (1000 + 1250)) + (t4_item2 * (800 + 5138)) + (t4_item3 * (1500 + 3366)));
        }
        // 프리미엄 4티 고승권 계산
        if (t4_premium) {
            t4_premium.textContent = formatResult((t4_item1 * (1500 + 1883 + 1950 + 765)) + (t4_item2 * (1300 + 7903)) + (t4_item3 * (2300 + 5165)));
        }

        // 세트
        // #stash 계산
        if (stash) {
            const stashEff = (2760 / (6000 / result) * 100);
            const floorEff = Math.floor(stashEff * 100) / 100;
            stash.textContent = Number(floorEff.toFixed(2)).toLocaleString();
        }
        // #stashing 계산
        if (stashing) {
            const stashingEff = (2785 / (6000 / result) * 100);
            const floorEff = Math.floor(stashingEff * 100) / 100;
            stashing.textContent = Number(floorEff.toFixed(2)).toLocaleString();
        }

        // #every2 계산
        if (every) {
            const totalValueInCrystal = (data * 840) + 300;
            const costInCrystal = 15000 / result;
            
            if (costInCrystal !== 0) {
                const everyEff = (totalValueInCrystal / costInCrystal) * 100;
                const floorEff = Math.floor(everyEff * 100) / 100;
                
                every.textContent = Number(floorEff.toFixed(2)).toLocaleString();
                everyx.textContent = Number(floorEff.toFixed(2)).toLocaleString();
            }
        }

        // 4. #365tier4 계산
        if (t4_365) {
            const val1 = X * 15;
            const val2 = X * 10;
            const val3 = X * 12;
            const numerator = (val1 * 7300) + (val2 * 10950) + (val3 * 9125) + 3300;
            const denominator = 45000 / result;

            if (denominator !== 0) {
                const t4_365Eff = (numerator / denominator) * 100;
                const floorEff = Math.floor(t4_365Eff * 100) / 100;
                t4_365.textContent = Number(floorEff.toFixed(2)).toLocaleString();
            }
        }

        checkEfficiencyClasses();
        updateTotalCrystal(); // 기준 가치(result)가 변하면 총 효율도 변해야 함
    }

    // 1. #info 요소 가져오기
    const info = document.getElementById("info");

    // 2. 마우스 움직임에 따라 #info 이동
    window.addEventListener("mousemove", (e) => {
        info.style.left = (e.pageX) + "px"; 
        info.style.top = (e.pageY) + "px";
    });

    // 3. .title 호버 이벤트 처리
    const titles = document.querySelectorAll(".title");
    titles.forEach((t) => {
        t.addEventListener("mouseenter", () => {
            info.textContent = t.textContent.trim(); 
            info.classList.add("hover"); 
        });

        t.addEventListener("mouseleave", () => {
            info.classList.remove("hover"); 
        });
    });

    // [전체 합계 계산 함수] 모든 .result_crystal 합쳐서 하단에 출력
    function updateTotalCrystal() {
        const allResultSpans = document.querySelectorAll("#check_list .result_crystal");
        const totalOutput = document.querySelector(".all_crystal .result_crystal");
        const allPercentOutput = document.querySelector(".efficient .all_percent");
        
        let sum = 0;
        allResultSpans.forEach(span => {
            const val = parseFloat(span.textContent.replace(/,/g, "")) || 0;
            sum += val;
        });

        if (totalOutput) {
            // [수정] .result_crystal 전용 99999 보정
            let tempStr = sum.toFixed(15);
            if (/\.9{5,}/.test(tempStr)) {
                totalOutput.textContent = formatResult(Math.round(sum));
            } else {
                totalOutput.textContent = formatResult(sum);
            }
        }

        // [추가] 효율 계산 로직
        if (allPercentOutput) {
            const checkCash = document.getElementById("check_cash");
            const checkCrystal = document.getElementById("check_crystal");
            const allCrystalSum = sum;
            let finalEff = 0;

            if (checkCash.classList.contains("on")) {
                const cashInput = checkCash.querySelector("input");
                const resultVal = Number(won.value) / Number(crystal.value); // const result 값 가져오기
                const cashValue = Number(cashInput.value) || 0;

                // 계산: (전체수정합계 / (현금입력 / 1수정가치)) * 100
                if (allCrystalSum !== 0 && resultVal !== 0 && cashValue !== 0) {
                    finalEff = (allCrystalSum / (cashValue / resultVal)) * 100;
                }
            } else if (checkCrystal.classList.contains("on")) {
                const crystalInput = checkCrystal.querySelector("input");
                const inputCrystalValue = Number(crystalInput.value) || 0;

                // [수정] 수정 활성화 시: (전체수정합계 / 수정입력) * 100
                if (allCrystalSum !== 0 && inputCrystalValue !== 0) {
                    finalEff = (allCrystalSum / inputCrystalValue) * 100;
                }
            }

            // 소수점 3번째에서 버려 2번째 자리까지 표시 (Math.floor(* 100) / 100)
            const floorEff = Math.floor(finalEff * 100) / 100;
            allPercentOutput.textContent = floorEff.toLocaleString();
        }

        // [핵심] 합계가 계산된 후 반드시 효율 클래스 체크를 실행하여 색상 반영
        checkEfficiencyClasses();
    }

    // 4. 아이템 클릭 시 선택 목록(#check_list)에 추가하는 기능
    const menuItems = document.querySelectorAll("#menu_s > div, #menu_r > div");
    const checkList = document.getElementById("check_list");

    menuItems.forEach(item => {
        item.addEventListener("click", function() {
            const originClass = this.getAttribute("class");
            const titleText = this.querySelector(".title")?.textContent.trim();

            const isDuplicate = Array.from(checkList.querySelectorAll(".title"))
                .some(existingTitle => existingTitle.textContent.trim() === titleText);

            if (isDuplicate) return;

            const imgSrc = this.querySelector("img")?.src;
            
            const rawPriceText = this.querySelector(".price span")?.textContent.replace(/,/g, "") || "0";
            const priceVal = parseFloat(rawPriceText);
            
            const newDetail = document.createElement("div");
            newDetail.className = originClass;

            newDetail.innerHTML = `
                <div class="item">
                    <img class="front" src="${imgSrc}" alt="${titleText}">
                    <img class="back" src="img/item_bg.png" alt="배경">
                    <div class="delete">X</div>
                </div>
                <h2 class="title">${titleText}</h2>
                <h3 class="price flex">
                    <span class="check_crystal">${formatResult(priceVal)}</span>
                    <img class="info_crystal" src="img/item/cash.png" alt="수정">
                    <span>×</span>
                    <input type="number" class="check_input" value="1" min="1">
                </h3>
                <h2 class="result flex">
                    <span>총</span>
                    <span class="result_crystal">${formatResult(priceVal)}</span>
                    <img class="info_crystal" src="img/item/cash.png" alt="수정">
                </h2>
            `;

            const deleteBtn = newDetail.querySelector(".delete");
            deleteBtn.addEventListener("click", function() {
                newDetail.remove();
                updateTotalCrystal(); 
            });

            const input = newDetail.querySelector(".check_input");
            const resultCrystal = newDetail.querySelector(".result_crystal");

            input.addEventListener("input", function() {
                const count = Number(this.value) || 0;
                const total = count * priceVal;
                
                let tempStr = total.toFixed(15);
                if (/\.9{5,}/.test(tempStr)) {
                    resultCrystal.textContent = formatResult(Math.round(total));
                } else {
                    resultCrystal.textContent = formatResult(total);
                }
                
                updateTotalCrystal(); 
            });

            checkList.appendChild(newDetail);
            updateTotalCrystal(); 

            const t = newDetail.querySelector(".title");
            t.addEventListener("mouseenter", () => {
                info.textContent = t.textContent.trim();
                info.classList.add("hover");
            });
            t.addEventListener("mouseleave", () => {
                info.classList.remove("hover");
            });
        });
    });

    // #check_cash 내의 input 값이 변할 때도 효율 계산 업데이트
    const checkCashInput = document.querySelector("#check_cash input");
    if (checkCashInput) {
        checkCashInput.addEventListener("input", updateTotalCrystal);
    }

    // [추가] #check_crystal 내의 input 값이 변할 때도 효율 계산 업데이트
    const checkCrystalInput = document.querySelector("#check_crystal input");
    if (checkCrystalInput) {
        checkCrystalInput.addEventListener("input", updateTotalCrystal);
    }

    formatPrice();
    updateValue();
    updateMenu();
    updateTotalCrystal(); 
    
    crystal.addEventListener("input", updateValue);
    won.addEventListener("input", updateValue);
};