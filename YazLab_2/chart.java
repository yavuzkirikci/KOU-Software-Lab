import java.util.HashMap;
import java.util.TreeMap;
import javax.swing.JFrame;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.CategoryDataset;
import org.jfree.data.category.DefaultCategoryDataset;

public class chart extends JFrame {

  private static final long serialVersionUID = 1L;
  HashMap<String, Integer> timeIntervals;
  HashMap<String, Integer> timeIntervals_10thread;

  public chart(String appTitle, HashMap<String, Integer> timeIntervals, HashMap<String, Integer> timeIntervals_10thread) {
    super(appTitle);
    this.timeIntervals = timeIntervals;
    this.timeIntervals_10thread = timeIntervals_10thread;
    // Create Dataset
    CategoryDataset dataset = createDataset();
    


    //Create chart
    JFreeChart chart=ChartFactory.createBarChart(
        "Time Interval", // Category axis
        "Process Count", // Value axis
        appTitle, dataset,
        PlotOrientation.VERTICAL,
        true,true,false
       );

    ChartPanel panel=new ChartPanel(chart);
    setContentPane(panel);
  }

  private TreeMap<Integer, String> sortKeys(HashMap<String,Integer> timeIntervals){

    HashMap<Integer, String> key_value = new HashMap<>();
    for (HashMap.Entry<String, Integer> entry : timeIntervals.entrySet()){
      String key = entry.getKey();
      int i = 0;
      for (i = 0; i < key.length(); i++) {
        if(key.charAt(i) == ' ')
          break;
      }
      key_value.put(Integer.valueOf(key.substring(0, i)), key);
    }

    return new TreeMap<>(key_value);
  }

  private CategoryDataset createDataset() {
    DefaultCategoryDataset dataset = new DefaultCategoryDataset();
    
    for (HashMap.Entry<Integer, String> entry : sortKeys(timeIntervals).entrySet()){
      dataset.addValue(timeIntervals.get(entry.getValue()), "5 Thread", entry.getValue());
    }

    for (HashMap.Entry<Integer, String> entry : sortKeys(timeIntervals_10thread).entrySet()){
      dataset.addValue(timeIntervals_10thread.get(entry.getValue()), "10 Thread", entry.getValue());
    }
    return dataset;
  }

}