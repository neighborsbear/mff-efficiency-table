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

    cBtn.addEventListener("click", function () {
        cBtn.classList.add("on");
        sBtn.classList.remove("on");
        rBtn.classList.remove("on");
        updateMenu();
    });

    sBtn.addEventListener("click", function () {
        sBtn.classList.add("on");
        cBtn.classList.remove("on");
        rBtn.classList.remove("on");
        updateMenu();
    });

    rBtn.addEventListener("click", function () {
        rBtn.classList.add("on");
        cBtn.classList.remove("on");
        sBtn.classList.remove("on");
        updateMenu();
    });

    cmbtn_cash.addEventListener("click", function () {
        cmbtn_cash.classList.add("on");
        cmbtn_crystal.classList.remove("on");
        updateMenu();
    });

    cmbtn_crystal.addEventListener("click", function () {
        cmbtn_crystal.classList.add("on");
        cmbtn_cash.classList.remove("on");
        updateMenu();
    });

    // 알려주신 정규식 방식을 사용하여 #menu .price span 요소들만 변경
    function formatPrice() {
        const prices = document.querySelectorAll("#menu .price span");
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

    function checkEfficiencyClasses() {
        const efficientBoxes = document.querySelectorAll(".efficient");
        
        efficientBoxes.forEach(box => {
            const percentSpan = box.querySelector(".percent");
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
        const regex = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;

        if (crystalValue === 0) {
            value.textContent = "계산 불가";
            return;
        }

        // 1수정당 가치 계산
        const result = wonValue / crystalValue;
        value.textContent = result.toString().replace(regex, ",") + "원";

        // 재료 가치
        // 생데 가치
        const data = 1813 / 930

        // [추가] 티어-4 재료 패키지 계산 (100% 효율 가정)
        // 1. 패키지 전체의 수정 가치에서 기본 포함 수정(5500)을 뺀 '재료만의 수정 가치'를 구함
        const totalMaterialCrystal = (119000 / result) - 5500;

        /* 
           2. 가치 비율 적용 (4생씨 = 5팔틴 = 6카보 가치가 동일 가치)
           개당 가치 비율은 역수 비인 (1/4) : (1/5) : (1/6) 이며,
           이를 정수비로 환산하면 생씨(15) : 팔틴(12) : 카보(10) 가 됩니다.
           총 가치 단위(Unit) = (개수 * 가중치)
           2100*15 + 3800*12 + 4500*10 = 31500 + 45600 + 45000 = 122100
        */
        const X = totalMaterialCrystal / 122100;
        const t4_item1 = X * 15;
        const t4_item2 = X * 10;
        const t4_item3 = X * 12;

        // #t2 계산
        if (t2) {
            const t2Eff = data * 167;
            t2.textContent = t2Eff.toString().replace(regex, ",");
        }

        // #em 계산
        if (em5) {
            const efficiency = (30000 / result) - 1500;
            em5.textContent = efficiency.toString().replace(regex, ",");
        }
        // 신화엠블럼 확률 0.4999% 전설엠블럼 확률 1.7%
        if (em6) {
            const efficiency = ((30000 / result) - 1500) * 1.7/ 0.4999;
            em6.textContent = efficiency.toString().replace(regex, ",");
        }

        // #unequip 계산
        if (unequip) {
            const unequipEff = (12000 / result) - 100;
            unequip.textContent = unequipEff.toString().replace(regex, ",");
        }
        // #unoru 계산
        if (unoru) {
            const unoruEff = (12000 / result) - 100;
            unoru.textContent = unoruEff.toString().replace(regex, ",");
        }

        // 4티 각 재료별 수정 가치
        if (t4_1) t4_1.textContent = (t4_item1).toString().replace(regex, ",");
        if (t4_2) t4_2.textContent = (t4_item2).toString().replace(regex, ",");
        if (t4_3) t4_3.textContent = (t4_item3).toString().replace(regex, ",");

        // 4티 승급권 계산
        if (t4_normal) {
            const t4_normalEff =( t4_item1 * 1000) + (t4_item2 * 800) + (t4_item3 * 1500);
            t4_normal.textContent = t4_normalEff.toString().replace(regex, ",");
        }
        // 4티 고승권 계산
        if (t4_advanced) {
            const t4_advancedEff =( t4_item1 * (1000 + 1250)) + (t4_item2 * (800 + 5138)) + (t4_item3 * (1500 + 3366));
            t4_advanced.textContent = t4_advancedEff.toString().replace(regex, ",");
        }
        // 프리미엄 4티 고승권 계산
        if (t4_premium) {
            const t4_premiumEff =( t4_item1 * (1500 + 1883 + 1950 + 765)) + (t4_item2 * (1300 + 7903)) + (t4_item3 * (2300 + 5165));
            t4_premium.textContent = t4_premiumEff.toString().replace(regex, ",");
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
            // 각 재료의 1개당 가치 (이미 계산된 X 활용)
            const val1 = X * 15; // 생씨 1개 가치
            const val2 = X * 10; // 카보 1개 가치
            const val3 = X * 12; // 팔틴 1개 가치

            // 분자: (365일 총 재료 가치) + (즉시 지급 수정 가치)
            // 생씨: 20개 * 365일 = 7,300개
            // 카보: 30개 * 365일 = 10,950개
            // 팔틴: 25개 * 365일 = 9,125개
            // 수정 3,300개 지급
            const numerator = (val1 * 7300) + (val2 * 10950) + (val3 * 9125) + 3300;

            // 분모: 45,000원이 현재 가치(result)로 몇 수정인지 계산
            const denominator = 45000 / result;

            if (denominator !== 0) {
                // 효율(%) = (총 가치 / 지불 가치) * 100
                const t4_365Eff = (numerator / denominator) * 100;
                
                // 소수점 처리 및 출력
                const floorEff = Math.floor(t4_365Eff * 100) / 100;
                t4_365.textContent = Number(floorEff.toFixed(2)).toLocaleString();
            }
        }

        checkEfficiencyClasses();
    }

    formatPrice();
    updateValue();
    updateMenu();
    checkEfficiencyClasses();

    // 1. #info 요소 가져오기
    const info = document.getElementById("info");

    // 2. 마우스 움직임에 따라 #info 이동
    window.addEventListener("mousemove", (e) => {
        info.style.left = e.pageX + "px";
        info.style.top = e.pageY + "px";
    });

    // 3. .title 호버 이벤트 처리
    // (이미 titles 변수가 선언되어 있다면 아래 titles.forEach만 사용)
    const titles = document.querySelectorAll(".title");
    titles.forEach((t) => {
        t.addEventListener("mouseenter", () => {
            info.textContent = t.textContent.trim(); // 내용 복사
            info.classList.add("hover"); // 클래스 추가
        });

        t.addEventListener("mouseleave", () => {
            info.classList.remove("hover"); // 클래스 제거
        });
    });

    crystal.addEventListener("input", updateValue);
    won.addEventListener("input", updateValue);
};