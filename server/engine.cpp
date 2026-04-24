#include <iostream>
using namespace std;

class Game {
public:
    virtual string hint(int r) = 0;
    virtual string check(int r, string a) = 0;
};

class Horror : public Game {
public:

    string hint(int r) override {
        switch(r) {
            case 1: return "darkness";
            case 2: return "flow";
            case 3: return "life";
            case 4: return "slow";
            case 5: return "silent";
            case 6: return "fear";
            case 7: return "freedom";
        }
        return "";
    }

    string check(int r, string a) override {
        if(r==1 && a=="shadow") return "correct";
        if(r==2 && a=="river") return "correct";
        if(r==3 && a=="blood") return "correct";
        if(r==4 && a=="time") return "correct";
        if(r==5 && a=="silence") return "correct";
        if(r==6 && a=="fear") return "correct";
        if(r==7 && a=="freedom") return "correct";
        return "wrong";
    }
};

int main() {
    Horror g;

    string mode;
    int room;
    string ans;

    cin >> mode >> room;

    if(mode == "hint") {
        cout << g.hint(room);
    }

    else if(mode == "check") {
        cin >> ans;
        cout << g.check(room, ans);
    }
}