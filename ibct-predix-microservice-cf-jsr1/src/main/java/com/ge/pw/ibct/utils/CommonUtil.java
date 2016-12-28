package com.ge.pw.ibct.utils;

import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.beanutils.BeanMap;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.beanutils.PropertyUtilsBean;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;

public class CommonUtil {
	
	public static final String SQL_DATE_FORMAT="yyyy-MM-dd";
	public static final String USER_DATE_FORMAT="MM/dd/yyyy";
	public static final String DATE_FORMAT_MM_DD_YYYY="MM-dd-yyyy";
	public static boolean compareObjects(Object oldObject, Object newObject) throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
        BeanMap map = new BeanMap(oldObject);

        PropertyUtilsBean propUtils = new PropertyUtilsBean();
        boolean compare = true;
        for (Object propNameObject : map.keySet()) {
            String propertyName = (String) propNameObject;
            Object property1 = propUtils.getProperty(oldObject, propertyName);
            Object property2 = propUtils.getProperty(newObject, propertyName);
            if (!property1.equals(property2)) {
            	compare = false;	//objects are in different state(modified)
            	break;
            } 
        }
        return compare;
    }
	public static int getContractStatusId(String statusDesc){
		Map<Integer, String> statusMap =  new HashMap<Integer,String>();
		statusMap.put(1, "WIP");
		statusMap.put(2, "Shared With Customer");
		statusMap.put(3, "Submitted");
		/*if(statusMap.get(statusDesc)!=null){
			return Integer.parseInt(statusMap.get(statusDesc));
		}
		else*/ 
		return 1;
		
	}
	
	/*public static String createComment(){
		String comment = IEDIConstants.activityComment;
		comment = comment.replace("{{user}}", "User");
		comment = comment.replace("{{action}}", "Created");
		comment = comment.replace("{{input}}", "a new");
		comment = comment.replace("{{type}}", "contract");
		return comment;
	}
	
	public static String createComment(String user, String action, String input, String type){
		String comment = IEDIConstants.activityComment;
		comment = comment.replace("{{user}}", user);
		comment = comment.replace("{{action}}", action);
		comment = comment.replace("{{input}}", input);
		comment = comment.replace("{{type}}", type);
		return comment;
	}*/
	
	public static void populateWSResponseStatusSuccessResponse(
			WSResponseStatus wsResponseStatus) {
		wsResponseStatus.setStatusCode("200");
		wsResponseStatus.setStatusMessage("success");
	
	}
	
	//start
	
	public static void populateWSResponseStateSuccessResponse(
			WSResponseStatus wsResponseStatus) {
		wsResponseStatus.setStatusCode("200");
		wsResponseStatus.setStatusMessage("scenario created successfully");
	
	}
	
	//end
	
	public static void populateWSResponseStatusFailsureStatusResponse(
			WSResponseStatus wsResponseStatus, String errorMsg) {
		if(wsResponseStatus==null){
			wsResponseStatus = new WSResponseStatus();
			Map<String,Object> dataMap = new HashMap<String, Object>(0);
			wsResponseStatus.setDataMap(dataMap);
		}
		wsResponseStatus.setStatusCode("500");
		wsResponseStatus.setStatusMessage("fail");
		wsResponseStatus.setErrorMsg(errorMsg);
		
	}
	
	public static void populateWSResponseStatusFailsureStatusResponse(
			WSResponseStatus wsResponseStatus, String errorMsg,String errorCode) {
		if(wsResponseStatus==null){
			wsResponseStatus = new WSResponseStatus();
			Map<String,Object> dataMap = new HashMap<String, Object>(0);
			wsResponseStatus.setDataMap(dataMap);
		}
		wsResponseStatus.setStatusCode(errorCode);
		wsResponseStatus.setStatusMessage("fail");
		wsResponseStatus.setErrorMsg(errorMsg);
		wsResponseStatus.setDefaultErrMsg(errorMsg);
		
		
	}
	
public static void converDateForList(List<?> beans,String toFormat,String[] propertyNames){
		
		for (Object bean : beans) {
			convertDateForBean(bean, toFormat, propertyNames);
		}
		
	}
	public static void convertDateForBean(Object bean,String toFormat,String[] propertyNames){
		
		Object date;
		try {
			for (String propertyName : propertyNames) {
			date = PropertyUtils.getProperty(bean, propertyName);
			if(date!=null){
				  Date dateObj= DateUtils.parseDate(date.toString(), new String[]{"MM/dd/yyyy","dd/MM/yyyy","yyyy-MM-dd"});
				  String convertedDate=DateFormatUtils.format(dateObj, toFormat);
				  PropertyUtils.setProperty(bean, propertyName, convertedDate);
				}
			}
		} catch (Exception e) {
			
		} 
		
	}
	
	/*public static String toCSV(List<?> list){
		if(list != null){
			String csv = "";
			for (Object obj : list) {
				if(csv.length() > 0){
					csv += ", ";
				}
				
				csv += obj.toString();
			}
			
			return csv;
		} else {
			return null;
		}
	}*/
	
	public static String toCSV(Collection<?> list){
		if(list != null){
			String csv = "";
			for (Object obj : list) {
				if(csv.length() > 0){
					csv += ",";
				}
				
				csv += obj.toString();
			}
			
			return csv;
		} else {
			return null;
		}
	}
	public static Map<Object,List<Object>> getGroupedMap(List<?> dataList,String requiredKey) {
		Map<Object,List<Object>> groupedMap=new LinkedHashMap<Object, List<Object>>();
		for (Object objectData : dataList) {
		
		
			Object keyData;
			try {
				keyData = PropertyUtils.getProperty(objectData, requiredKey);
			} catch (Exception ex) {
				throw new RuntimeException("Error occured while grouping the data"+ex.toString());
			}
			
			List<Object> groupedObjects=groupedMap.get(keyData);
			if(groupedObjects==null){
				groupedObjects=new ArrayList<Object>();
				groupedMap.put(keyData, groupedObjects);
			}
			groupedObjects.add(objectData);
			
		}
		return groupedMap;
	}
	
	public static Map<Object,List<Object>> getGroupedMap(List<?> dataList,String requiredKey,String requiredValueKey) {
		Map<Object,List<Object>> groupedMap=new LinkedHashMap<Object, List<Object>>();
		try {
			for (Object objectData : dataList) {
				
				 Object	keyData = PropertyUtils.getProperty(objectData, requiredKey);
				
				List<Object> groupedObjects=groupedMap.get(keyData);
				if(groupedObjects==null){
					groupedObjects=new ArrayList<Object>();
					
					groupedMap.put(keyData, groupedObjects);
				}
				if(requiredValueKey!=null){
					
				    Object	valueData = PropertyUtils.getProperty(objectData, requiredValueKey);
				    groupedObjects.add(valueData);
				
				}else{
					groupedObjects.add(objectData);
				}
			}
		} catch (Exception ex) {
			throw new RuntimeException("Error occured while grouping the data"+ex.toString());
		}
		return groupedMap;
	}
	
	public static Map<Object,Object> getMapFromList(List<?> dataList,String requiredKey,String requiredDataValueKey) {
		Map<Object,Object> mapObj=new LinkedHashMap<Object, Object>();
		for (Object objectData : dataList) {
		
		
			Object keyData;
			Object keyDataValue;
				try {
						keyData = PropertyUtils.getProperty(objectData, requiredKey);
					
					
					if(requiredDataValueKey!=null) {
						keyDataValue = PropertyUtils.getProperty(objectData, requiredDataValueKey);
						mapObj.put(keyData, keyDataValue);
					}else {
						mapObj.put(keyData, objectData);
					}
				} catch (Exception ex) {
				throw new RuntimeException("Error occured while grouping the data"+ex.toString());
			}
		}
		return mapObj;
	}
	
	public static String toCSV(List<?> list,String propertyname){
		Set<String>dataSet=new LinkedHashSet<String>();
		
		if(list != null){
			for (Object obj : list) {
				Object data;
				try {
					data = PropertyUtils.getProperty(obj, propertyname);
				} catch (Exception e) {
				    throw new  RuntimeException("exception while in csv "+e.toString());
				}	
				   dataSet.add(data.toString());
			}
			
			return toCSV(dataSet);
		} else {
			return null;
		}
	}
	
	public static List<String> csvToList(String csv){
		List<String>list=new ArrayList<String>();
		if(!isEmpty(csv)){
			String[]data=csv.split(",");
			list = Arrays.asList(data);
		}
	     return list;
	}
	
	public static boolean isEmpty(String data){
		if(data==null || data.trim()=="") {
			return true;
		}
		return false;
	}
	
	public static String getDateinGivenFormat(Date date ,String format){
		if(date!=null){
			return DateFormatUtils.format(date, format);
		}
	 return null;
	}
	public static Date getDateFromString(String dateString){
		 Date dateObj;
		try {
			dateObj = DateUtils.parseDate(dateString, new String[]{"MM-dd-yyyy"});
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new RuntimeException(e.toString());
		}
	     return dateObj;
	}
	
	public static Date getDateFromStringFormat1(String dateString){
		 Date dateObj;
		try {
			dateObj = DateUtils.parseDate(dateString, new String[]{"yyyy-MM-dd"}); //2015-08-24
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new RuntimeException(e.toString());
		}
	     return dateObj;
	}
	
	
	public static Integer getYearFromDate(String dateString){
		return Integer.parseInt(dateString.split("-")[2]);
//		Date date=getDateFromString(dateString);
//		int year= Integer.parseInt(DateFormatUtils.format(date, "yyyy"));
//		return year;
//		Calendar calendar=Calendar.getInstance();
//		calendar.setTimeInMillis(date.getTime());
//		Integer year =calendar.get(Calendar.YEAR);
//		 return year;
	}
	
	public static Integer getYearFromDate(Date date){
//		int year= Integer.parseInt(DateFormatUtils.format(date, "yyyy"));
//		return year;
		Calendar calendar=Calendar.getInstance();
		calendar.setTimeInMillis(date.getTime());
		return calendar.get(Calendar.YEAR);
//		Integer year =calendar.get(Calendar.YEAR);
//		 return year;
	}
	

	
	
	public static void populateGivenDatatoList(List<?>targetList,Object source ,String[] propetyNames){
		try {
		Map<String,Object>dataMap=getDataMap(source,propetyNames);
		for (Object bean : targetList) {
				BeanUtils.populate(bean, dataMap);
			}
			 
	     }
		catch (Exception e) {
			throw new  RuntimeException("Error while populating data at line 295 in common Utils "+e.toString());
	    }
	}
	private static Map<String, Object> getDataMap(Object object,
			String[] propetyNames) throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
		 Map<String,Object>dataMap=new HashMap<String, Object>();
		for (String propertyName : propetyNames) {
			dataMap.put(propertyName, PropertyUtils.getProperty(object, propertyName));
		}
		
		return dataMap;
	}
	
	
	public static Map getMultiGroupedMap(List<?> dataList, String[] groupedBypropetyNames) {

		Map<Object,Object> parentMap=new HashMap<Object, Object>();
		try{
		Map currentMap=parentMap;
		for (Object data : dataList) {
			 currentMap=parentMap;
			for (int i=0;i< groupedBypropetyNames.length ; i++) {
				Object value=PropertyUtils.getProperty(data, groupedBypropetyNames[i]);
				
				if(i==groupedBypropetyNames.length-1){
					List list=(List)currentMap.get(value);
					if(list == null){
						list=new ArrayList();
						currentMap.put(value, list);
					}
					list.add(data);
				}else{
				    Map childmap = (Map)currentMap.get(value);
				    if(childmap==null){
				    	childmap=new LinkedHashMap();
				    	currentMap.put(value,childmap);
				    }
				    
				    currentMap=childmap;
				    
				    
				}
			}	
		}
		}catch(Exception ex){
			throw new RuntimeException("erroer while grouping"+ex.toString());
		}
		
	
		return parentMap;
	}
	
	
	/*public static double getSumOfGivenData(Collection<?>list,String propertyName){
		double sum=0;
		try{
		for (Object data : list) {
          sum = (double)sum +(double)PropertyUtils.getProperty(data, propertyName);		
	   }
	}catch(Exception ex){
		throw new RuntimeException(ex);
	}
		return sum;
  }
	
	
	public static  Integer getSumOfGivenDataForInt(Collection<?>list,String propertyName){
		int sum=0;
		try{
		for (Object data : list) {
          sum=(int)sum +(int)PropertyUtils.getProperty(data, propertyName);		
		
	   }
	
	}catch(Exception ex){
		throw new RuntimeException(ex);
	}
		return sum;
  }
	
	public static  double getSumOfGivenDataDoubleValues(Collection<?>list,String propertyName){
	
		double sum=0;
		try{
		for (Object data : list) {
          sum=(double)sum +(double)PropertyUtils.getProperty(data, propertyName);		
		
	   }
	
	}catch(Exception ex){
		throw new RuntimeException(ex);
	}
		return sum;
  }*/
	
	public static <T> Iterable<T> emptyIfNull(Iterable<T> iterable) {
	    return iterable == null ? Collections.<T>emptyList() : iterable;
	}
	
}
