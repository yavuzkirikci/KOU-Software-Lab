import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import javax.swing.SwingUtilities;
import javax.swing.WindowConstants;

class MyThread implements Runnable {

    Main m;
    ArrayList<Integer> intervals = new ArrayList<>();
    String threadName;
    Boolean inverse;

    @Override
    public void run() {
        m.calculateWritables(intervals.get(0), intervals.get(1), intervals.get(2), intervals.get(3), threadName, inverse);
    }

    MyThread(Main m, int x1, int x2, int y1, int y2, String threadName, Boolean inverse) {
        this.m = m;
        intervals.add(x1);
        intervals.add(x2);
        intervals.add(y1);
        intervals.add(y2);
        this.threadName = threadName;this.inverse = inverse;
    }

}

public class Main {

    ArrayList<ArrayList<Integer>> squares = new ArrayList<>();
    HashMap<String, ArrayList<Integer>> availables = new HashMap<>();
    ArrayList<String> steps = new ArrayList<>();
    public Boolean isDone = false;
    private long startTime;
    static ArrayList<Long> times = new ArrayList<>();

    public int checkChar(char i) {
        if (i == '*') {
            return 0;
        }
        return i - '0';
    }

    public String createKey(int i, int j) {
        return i + " " + j;
    }

    public void initAvailables() {
        for (int i = 0; i < 21; i++) {
            for (int j = 0; j < 21; j++) {
                ArrayList<Integer> temp = new ArrayList<>();
                for (int k = 1; k < 10; k++) {
                    temp.add(k);
                }
                availables.put(createKey(i, j), temp);
            }
        }
    }

    public void readFile(String file) {
        try {
            File myObj = new File(file);
            Scanner myReader = new Scanner(myObj);
            while (myReader.hasNextLine()) {
                String data = myReader.nextLine();

                ArrayList<Integer> temp = new ArrayList<>();

                if (data.length() < 21) {
                    if (data.length() < 18) {
                        for (int i = 0; i < 6; i++) {
                            temp.add(-1);
                        }
                        for (int i = 0; i < data.length(); i++) {
                            temp.add(checkChar(data.charAt(i)));
                        }
                        for (int k = 0; k < 6; k++) {
                            temp.add(-1);
                        }
                    } else {
                        for (int i = 0; i < 9; i++) {
                            temp.add(checkChar(data.charAt(i)));
                        }
                        for (int i = 0; i < 3; i++) {
                            temp.add(-1);
                        }
                        for (int i = 9; i < data.length(); i++) {
                            temp.add(checkChar(data.charAt(i)));
                        }
                    }
                } else {
                    for (int i = 0; i < data.length(); i++) {
                        temp.add(checkChar(data.charAt(i)));
                    }
                }
                squares.add(temp);

            }
            myReader.close();
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }

    public void printSquares() {
        for (int i = 0; i < squares.size(); i++) {
            for (int j = 0; j < squares.size(); j++) {
                if (squares.get(i).get(j) != -1)
                    System.out.print(squares.get(i).get(j));
                else
                    System.out.print("*");
            }
            System.out.println("");
        }
    }

    public void printAvailables() {
        for (int i = 0; i < 21; i++) {
            for (int j = 0; j < 21; j++) {
                System.out.println(i + " " + j + " => " + availables.get(createKey(i, j)));
            }
        }
    }

    public String[] checkException(int x, int y) {
        if ((x >= 6 && x <= 8) && (y >= 6 && y <= 8)) {
            // sol üst
            return new String[] { "sol", "ust" };
        } else if ((x >= 6 && x <= 8) && (y >= 12 && y <= 14)) {
            // sol alt
            return new String[] { "sol", "alt" };
        } else if ((x >= 12 && x <= 14) && (y >= 6 && y <= 8)) {
            // sağ üst
            return new String[] { "sag", "ust" };
        } else if ((x >= 12 && x <= 14) && (y >= 12 && y <= 14)) {
            // sağ alt
            return new String[] { "sag", "alt" };
        }
        return new String[] { "none" };
    }

    public void deleteFrom(int val, int x, int y) {
        // System.out.println(val + " " + availables.get(createKey(x, y)));
        for (int i = 0; i < availables.get(createKey(x, y)).size(); i++) {
            if (availables.get(createKey(x, y)).get(i) == val) {
                availables.get(createKey(x, y)).remove(i);

            }
        }
        // System.out.println("Çozuldu" + " " + availables.get(createKey(x, y)));
    }

    public void check3by3(int x, int y, int val) {
        int i = x - (x % 3);
        int j = y - (y % 3);
        for (int j2 = i; j2 < i + 3; j2++) {
            for (int k = j; k < j + 3; k++) {
                deleteFrom(val, j2, k);
            }
        }
    }

    public void checkSquare(int x, int y, int x1, int x2, int y1, int y2, int val, String threadName) {
        int val_2 = val;
        if (val == -1) {
            val = squares.get(x).get(y);
        }
        String[] control = checkException(x, y);
        if (!(control[0].equals("none"))) {
            if (control[0] == "sol") {
                for (int i = 0; i <= 5; i++) {
                    deleteFrom(val, i, y);
                }
            }
            if (control[0] == "sag") {
                for (int i = 15; i <= 20; i++) {
                    deleteFrom(val, i, y);
                }
            }
            if (control[1] == "ust") {
                for (int i = 0; i <= 5; i++) {
                    deleteFrom(val, x, i);
                }
            }
            if (control[1] == "alt") {
                for (int i = 15; i <= 20; i++) {
                    deleteFrom(val, x, i);
                }
            }
        }
        for (int x_ = x1; x_ <= x2; x_++) {
            deleteFrom(val, x_, y);
        }
        for (int y_ = y1; y_ <= y2; y_++) {
            deleteFrom(val, x, y_);
        }
        check3by3(x, y, val);
        squares.get(x).set(y, val);
        if (val_2 != -1) {
            times.add(System.currentTimeMillis() - startTime);
            steps.add(x + " satır " + y + " sutununa " + val + " degeri eklendi " + "/ thread : " + threadName);
        }
        /*
         * if(flag){ System.out.println(x + " " + y + " index " + val + " silindi");
         * System.out.println(availables.get(createKey(1, 18))); printSquares();
         * 
         * }
         */
    }

    public void checkSquares(int x1, int x2, int y1, int y2) {
        for (int x = x1; x <= x2; x++) {
            for (int y = y1; y <= y2; y++) {
                if (squares.get(x).get(y) != 0 && squares.get(x).get(y) != -1) {
                    // thread lock
                    synchronized(this){
                        checkSquare(x, y, x1, x2, y1, y2, -1, "");
                    }
                    
                }
            }
        }
    }

    public void findOnes(int x1, int x2, int y1, int y2, String threadName, Boolean inverse) {
        if(inverse){
            for (int i = x2; i >= x1; i--) {
                for (int j = y2; j >= y1; j--) {
                    if (squares.get(i).get(j) == 0 && availables.get(createKey(i, j)).size() == 1) {
                        // thread lock
                        synchronized(this){
                            isDone = true;
                            // squares.get(i).set(j, availables.get(createKey(i, j)).get(0));
                            checkSquare(i, j, x1, x2, y1, y2, availables.get(createKey(i, j)).get(0), threadName);
                            // deleteFrom(availables.get(createKey(i, j)).get(0), i, j);
                        }
                        
                    }
                }
            }
        }
        else{
            for (int i = x1; i <= x2; i++) {
                for (int j = y1; j <= y2; j++) {
                    if (squares.get(i).get(j) == 0 && availables.get(createKey(i, j)).size() == 1) {
                        // thread lock
                        synchronized(this){
                            isDone = true;
                            // squares.get(i).set(j, availables.get(createKey(i, j)).get(0));
                            checkSquare(i, j, x1, x2, y1, y2, availables.get(createKey(i, j)).get(0), threadName);
                            // deleteFrom(availables.get(createKey(i, j)).get(0), i, j);
                        }
                        
                    }
                }
            }
        }
        
    }

    public void searchSingle(int x, int y, int x1, int x2, int y1, int y2, String threadName) {
        ArrayList<Integer> numRepeat = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            numRepeat.add(0);
        }
        for (int i = x; i < x + 3; i++) {
            for (int j = y; j < y + 3; j++) {
                if (squares.get(i).get(j) == 0) {
                    ArrayList<Integer> av = availables.get(createKey(i, j));
                    for (int j2 = 0; j2 < av.size(); j2++) {
                        int num = av.get(j2);
                        numRepeat.set(num, numRepeat.get(num) + 1);
                    }

                }

            }
        }

        for (int i = 1; i < 10; i++) {
            if (numRepeat.get(i) == 1) {
                isDone = true;
                // find square index
                int index_i = 0, index_j = 0;
                for (int i2 = x; i2 < x + 3; i2++) {
                    for (int j2 = y; j2 < y + 3; j2++) {
                        if (squares.get(i2).get(j2) == 0) {
                            ArrayList<Integer> av = availables.get(createKey(i2, j2));
                            for (int j3 = 0; j3 < av.size(); j3++) {
                                if (av.get(j3) == i) {
                                    index_i = i2;
                                    index_j = j2;
                                }
                            }
                        }

                    }
                }

                // squares.get(x).set(y, i);
                checkSquare(index_i, index_j, x1, x2, y1, y2, i, threadName);
                // deleteFrom(i, index_i, index_j);
            }
        }
    }

    public void findSingle(int x1, int x2, int y1, int y2, String threadName, Boolean inverse) {
        if(inverse){
            for (int i = x2 - 2; i >= x1; i -= 3) {
                for (int j = y2 - 2; j >= y2; j -= 3) {
                    if (squares.get(i).get(j) != -1)
                        searchSingle(i, j, x1, x2, y1, y2, threadName);
                }
            }
        }
        else{
            for (int i = x1; i < x2; i += 3) {
                for (int j = y1; j < y2; j += 3) {
                    if (squares.get(i).get(j) != -1)
                        searchSingle(i, j, x1, x2, y1, y2, threadName);
                }
            }
        }
    }

    public Boolean isSudokuSolved() {
        for (int i = 0; i < 21; i++) {
            for (int j = 0; j < 21; j++) {
                if (squares.get(i).get(j) == 0) {
                    return false;
                }
            }
        }

        return true;
    }

    public Boolean isWrongDecision() {
        for (int i = 0; i < 21; i++) {
            for (int j = 0; j < 21; j++) {
                ArrayList<Integer> av = availables.get(createKey(i, j));
                if (squares.get(i).get(j) == 0 && av.size() == 0) {
                    /*
                     * System.out.println("wrong decision"); System.out.println(i + " " + j + av);
                     */
                    return true;
                }
            }
        }
        return false;
    }

    public ArrayList<Integer> findInterval(int i, int j) {
        ArrayList<Integer> a = new ArrayList<>();

        if (i >= 6 && i <= 14 && j >= 6 && j <= 14) {
            a.add(6);
            a.add(14);
            a.add(6);
            a.add(14);
            return a;
        }
        if (i >= 0 && i <= 8 && j >= 0 && j <= 8) {
            a.add(0);
            a.add(8);
            a.add(0);
            a.add(8);
            return a;
        }
        if (i >= 0 && i <= 8 && j >= 12 && j <= 20) {
            a.add(0);
            a.add(8);
            a.add(12);
            a.add(20);
            return a;
        }
        if (i >= 12 && i <= 20 && j >= 0 && j <= 8) {
            a.add(12);
            a.add(20);
            a.add(0);
            a.add(8);
            return a;
        }
        a.add(12);
        a.add(20);
        a.add(12);
        a.add(20);
        return a;
    }

    public void copySquares(ArrayList<ArrayList<Integer>> square1, ArrayList<ArrayList<Integer>> square2) {
        /* System.out.println(square2.size()); */
        for (int i = 0; i < square2.size(); i++) {
            ArrayList<Integer> temp = new ArrayList<>();
            for (int j = 0; j < square2.size(); j++) {
                temp.add(square2.get(i).get(j));
            }
            if (square1.size() == 21) {
                square1.set(i, new ArrayList<>(temp));
            } else
                square1.add(temp);
        }
    }

    public void calculateWritables(int x1, int x2, int y1, int y2, String threadName, Boolean inverse) {
        findOnes(x1, x2, y1, y2, threadName, inverse);
        findSingle(x1, x2, y1, y2, threadName, inverse);
    }

    public Boolean checkSudoku() {
        for (int i = 0; i < 21; i++) {
            for (int j = 0; j < 21; j++) {
                if (squares.get(i).get(j) != -1) {
                    ArrayList<Integer> intervals = findInterval(i, j);
                    // check x coordinates
                    for (int k = intervals.get(0); k <= intervals.get(1); k++) {
                        if (k == i) {
                            continue;
                        }
                        if (squares.get(i).get(j) == squares.get(k).get(j)) {
                            return false;
                        }
                    }

                    // check y coordinates
                    for (int k = intervals.get(2); k <= intervals.get(3); k++) {
                        if (k == j) {
                            continue;
                        }
                        if (squares.get(i).get(j) == squares.get(i).get(k)) {
                            return false;
                        }
                    }

                    String[] control = checkException(i, j);
                    if (!(control[0].equals("none"))) {
                        if (control[0] == "sol") {
                            for (int i2 = 0; i2 <= 5; i2++) {
                                if (squares.get(i).get(j) == squares.get(i2).get(j)) {
                                    return false;
                                }
                            }
                        }
                        if (control[0] == "sag") {
                            for (int i2 = 15; i2 <= 20; i2++) {
                                if (squares.get(i).get(j) == squares.get(i2).get(j)) {
                                    return false;
                                }
                            }
                        }
                        if (control[1] == "ust") {
                            for (int i2 = 0; i2 <= 5; i2++) {
                                if (squares.get(i).get(j) == squares.get(i).get(i2)) {
                                    return false;
                                }
                            }
                        }
                        if (control[1] == "alt") {
                            for (int i2 = 15; i2 <= 20; i2++) {
                                if (squares.get(i).get(j) == squares.get(i).get(i2)) {
                                    return false;
                                }
                            }
                        }
                    }

                    // check 3 x 3
                    int x = i - (i % 3);
                    int y = j - (j % 3);
                    for (int k = x; k < x + 3; k++) {
                        for (int k2 = y; k2 < y + 3; k2++) {
                            if (!(k == i && k2 == j) && squares.get(i).get(j) == squares.get(k).get(k2)) {
                                return false;
                            }
                        }
                    }
                }
            }

        }
        return true;
    }

    public Boolean solveThread(String SOLVE_MODE) throws InterruptedException {
        while (true) {
            // printSquares();
            // System.out.println("\n\n\n\n");

            if (isWrongDecision()) {
                return false;

            }
            if (isSudokuSolved()) {
                if (checkSudoku()) {
                    return true;
                }
                return false;
            }

            isDone = false;
            if (SOLVE_MODE == "1 Thread") {
                findOnes(6, 14, 6, 14, " ", false);
                findSingle(6, 14, 6, 14, " ", false);
                findOnes(0, 8, 0, 8, " ", false);
                findOnes(12, 20, 0, 8, " ", false);
                findOnes(0, 8, 12, 20, " ", false);
                findOnes(12, 20, 12, 20, " ", false);
                findSingle(0, 8, 0, 8, " ", false);
                findSingle(12, 20, 0, 8, " ", false);
                findSingle(0, 8, 12, 20, " ", false);
                findSingle(12, 20, 12, 20, " ", false);
            }

            else if (SOLVE_MODE == "5 Thread") {
                // 5 Thread

                MyThread t4 = new MyThread(this, 6, 14, 6, 14, "thread 4", false);
                t4.run();
                MyThread t1 = new MyThread(this, 0, 8, 0, 8, "thread 1", false);
                t1.run();
                MyThread t2 = new MyThread(this, 12, 20, 0, 8, "thread 2", false);
                t2.run();
                MyThread t3 = new MyThread(this, 0, 8, 12, 20, "thread 3", false);
                t3.run();
                MyThread t5 = new MyThread(this, 12, 20, 12, 20, "thread 5", false);
                t5.run();

            } else {
                // 10 Thread
                MyThread t4 = new MyThread(this, 6, 14, 6, 14, "thread 4", false);
                t4.run();
                MyThread t1 = new MyThread(this, 0, 8, 0, 8, "thread 1", false);
                t1.run();
                MyThread t2 = new MyThread(this, 12, 20, 0, 8, "thread 2", false);
                t2.run();
                MyThread t3 = new MyThread(this, 0, 8, 12, 20, "thread 3", false);
                t3.run();
                MyThread t5 = new MyThread(this, 12, 20, 12, 20, "thread 5", false);
                t5.run();
                MyThread t6 = new MyThread(this, 14, 6, 14, 6, "thread 6", true);
                t6.run();
                MyThread t7 = new MyThread(this, 8, 0, 8, 0, "thread 7", true);
                t7.run();
                MyThread t8 = new MyThread(this, 20, 12, 8, 0, "thread 8", true);
                t8.run();
                MyThread t9 = new MyThread(this, 8, 0, 20, 12, "thread 9", true);
                t9.run();
                MyThread t10 = new MyThread(this, 20, 12, 20, 12, "thread 10", true);
                t10.run();

            }

            if (isDone == false) {
                for (int i = 0; i < 21; i++) {
                    for (int j = 0; j < 21; j++) {
                        if (squares.get(i).get(j) == 0) {
                            /* System.out.println("girdi"); */
                            ArrayList<Integer> av = availables.get(createKey(i, j));
                            for (int k = 0; k < av.size(); k++) {
                                Main m2 = new Main();
                                m2.startTime = startTime;
                                copySquares(m2.squares, squares);
                                for (Map.Entry<String, ArrayList<Integer>> entry : availables.entrySet())
                                    m2.availables.put(new String(entry.getKey()),
                                            new ArrayList<Integer>(entry.getValue()));
                                m2.steps = new ArrayList<>(steps);
                                ArrayList<Integer> a = findInterval(i, j);
                                m2.checkSquare(i, j, a.get(0), a.get(1), a.get(2), a.get(3), av.get(k), "Thread 1");
                                if (m2.solveThread(SOLVE_MODE)) {
                                    copySquares(squares, m2.squares);
                                    for (Map.Entry<String, ArrayList<Integer>> entry : m2.availables.entrySet())
                                        availables.put(new String(entry.getKey()),
                                                new ArrayList<Integer>(entry.getValue()));
                                    steps = new ArrayList<>(m2.steps);
                                    /* System.out.println("cozdum"); */
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                }
            }

        }
    }

    public void printSteps() {
        for (int i = 0; i < steps.size(); i++) {
            System.out.println(steps.get(i));
        }
    }


    public void writeStepsToFile(String filename){
        try {
            FileWriter myWriter = new FileWriter(filename);
            for (int i = 0; i < steps.size(); i++) {
                myWriter.write(steps.get(i) + "\n");
            }
            myWriter.close();
          } catch (IOException e) {
            System.out.println("An error occurred while writing steps to file");
            e.printStackTrace();
          }
    }

    public static void calculateTimeIntervals(ArrayList<Long> times_,HashMap<String, Integer> timeIntervals, int interval){
        for (int i = 0; i < times_.size(); i++) {
            long a = times_.get(i) - (times_.get(i) % interval);
            String key = String.valueOf(a) + " - " + String.valueOf(a + interval); 
            //System.out.println(key + " " + a);
            if(timeIntervals.containsKey(key)){
                timeIntervals.put(key, timeIntervals.get(key) + 1);
            }
            else{
                timeIntervals.put(key, 1);
            }
        }
    }

    public static void main(String[] args) throws InterruptedException, InvocationTargetException {
        // 5 Thread
        Main m = new Main();
        String filename = "samurai.txt";
        m.readFile(filename);
        m.initAvailables();
        m.checkSquares(0, 8, 0, 8);
        m.checkSquares(12, 20, 0, 8);
        m.checkSquares(0, 8, 12, 20);
        m.checkSquares(6, 14, 6, 14);
        m.checkSquares(12, 20, 12, 20);

        m.startTime = System.currentTimeMillis();

        m.solveThread("5 Thread");

        long end = System.currentTimeMillis();
        long elapsedTime = end - m.startTime;

        HashMap<String, Integer> timeIntervals = new HashMap<>();      
        m.writeStepsToFile("adimlar_5thread.txt");

        System.out.println("elapsed time (5 Thread) : " + elapsedTime + " ms");
        m.printSquares();
        ArrayList<Long> times_ = new ArrayList<>();
        for (int i = 0; i < Main.times.size(); i++) {   
            times_.add(Main.times.get(i));
        }
        Main.times = new ArrayList<>();
        System.out.println("\n\n\n\n");
        // 10 Thread
        Main m2 = new Main();
        m2.readFile(filename);
        m2.initAvailables();
        m2.checkSquares(0, 8, 0, 8);
        m2.checkSquares(12, 20, 0, 8);
        m2.checkSquares(0, 8, 12, 20);
        m2.checkSquares(6, 14, 6, 14);
        m2.checkSquares(12, 20, 12, 20);

        m2.startTime = System.currentTimeMillis();

        m2.solveThread("10 Thread");
        long end2 = System.currentTimeMillis();
        long elapsedTime2 = end2 - m2.startTime;

        HashMap<String, Integer> timeIntervals10_thread = new HashMap<>();    
        if(elapsedTime > elapsedTime2){
            Main.calculateTimeIntervals(times_, timeIntervals, (int)elapsedTime / 10);
            Main.calculateTimeIntervals(times, timeIntervals10_thread, (int)elapsedTime / 10);
        }
        else{
            Main.calculateTimeIntervals(times_, timeIntervals, (int)elapsedTime2 / 10);
            Main.calculateTimeIntervals(times, timeIntervals10_thread, (int)elapsedTime2 / 10);
        }
        //m2.calculateTimeIntervals(timeIntervals10_thread, elapsedTime2 / 5);      
        m2.writeStepsToFile("adimlar_10thread.txt");

        System.out.println("elapsed time (10 Thread) : " + elapsedTime2 + " ms");
        m2.printSquares();

        chart mychart = new chart("Time - Process Number Chart", timeIntervals, timeIntervals10_thread);

        SwingUtilities.invokeAndWait(()->{
            mychart.setSize(800, 400);
            mychart.setLocationRelativeTo(null);
            mychart.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
            mychart.setVisible(true);
        });
    }
}