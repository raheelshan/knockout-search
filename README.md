knockout-search-js
==================

<strong>A Plugin to make search friendly</strong>
<p>This plugin is useful for search</p>

<h2>Dependencies:</h2>

<ul>
   <li>KnockoutJS (2.2.0+) - http://knockoutjs.com/ </li>
   <li>Knockout Mapping Plugin</li>
</ul>

<h2>Usage</h2>

Create a variable and pass the observable array to database object

```html
	var myobject = ko.search.setData(self.Books())    
	self.Search(myobject)
```

Now the object is available. we can easily search. 

<h2>How to provide input</h2>

<p>Three types of inputs can be provided.</p>

<ul>
   <li>Observable Array</li>
   <li>Array of objects</li>
   <li>JSON String of array of objects</li>
</ul>

```html
	var myobject = ko.search.setData(self.Books()) // obervableArray    
	var myobject = ko.search.setData(books) // Array of objects    
	var myobject = ko.search.setData(booksJson) // json string of array of objects    
```

<h2>How to obtain search results</h2>

<p>Search results are easy to obtain in three ways.</p>

<ul>
   <li>Observable Array</li>
   <li>Array of objects</li>
   <li>JSON String</li>
</ul>

```html
	self.Search().get() // returns observable array      
	self.Search().get(true) // returns array of objects       
	self.Search().stringify() // returns array of objects in json string    
```

<p>Note : If you pass array of objects as parameter you will get array of objects instead of observable array in first example using .get()</p>    

<p>Note : I will be using `.stringify()` in the later example but you can choose any</p>

<h2>Function Reference</h2>

<h3>Getting Records</h3>

<h4>Get All Records</h4>

```html
	self.Search().get()  // Or     
	self.Search().get(true) // Or    
	self.Search().stringify()    
```

<h4>Get first record</h4>

```html
	self.Search().first().stringify()
```

<h4>Get last record    </h4>

```html
	self.Search().last().stringify()
```

<h4>Get records in array format starting from index  2</h4>

```html
	self.Search().start(2).stringify()
```

<h4>Get limited records in array format starting from 0 index</h4>

```html
	self.Search().limit(2).stringify()
```

<h4>Get from specific index with limited records in array format</h4>

```html
	self.Search().start(8).limit(2).stringify()
```

<h3>Searching Records</h3>

<h4>Simple codition to filter records    </h4>
<h5>Search where Price = 200</h5>
```html
	self.Search().filter({Price:200}).stringify()    
```

<h4>Simple and codition to filter records</h4>
<h5>Search where Price = 200 and Rate = 5</h5>
```html
	self.Search().filter({Price:200,Rate:5}).stringify()    
```

<h4>Simple or codition to filter records</h4>
<h5>Search where Rate = 4 or Rate = 5</h5>
```html
	self.Search().filter({Rate:[4,5]}).stringify()    
```

<h4>And and Or codition to filter records    </h4>
<p>
	Search where Price = 200 and Id = 1 Or Rate = 16    
</p>

```html
	self.Search().filter({Price:200,Id:[1,16]}).stringify() // Or    
	self.Search().filter({Id:[1,16],Price:200}).stringify()    
```

<h4>Filter with custom value</h4>
<h5>Search where Rate > 4</h5>
```html
	self.Search().filter({Rate:{value:4,condition:">"}}).stringify()    
```

<h4>Filter Chaining	</h4>
<h5>And and Or coditions can be used using chaining method</h5>
```html
	self.Search().filter({Rate:[4,5]}).filter({Id:{value:8,condition:">"}}).stringify()    
```

<h4>Filter with multiple custom values</h4>
<h5>For multiple custom values only chaining method will work</h5>
```html
	self.Search().filter({Price:{value:200,condition:">"}}).filter({Id:{value:15,condition:"<"}}).stringify()    
```

<h5>For multiple custom values this will not work and bring undesired results</h5>
```html
	self.Search().filter({Price:{value:200,condition:">"},Id:{value:15,condition:"<"}}).stringify()    
	self.Search().filter({Price:{value:200,condition:">"}},{Id:{value:15,condition:"<"}}).stringify()   		
```

<h3>Selecting Record Columns</h3>

<h4>Select specific columns. Note the Order</h4>
<h5>Select Only Name and Price columns</h5>
```html
	self.Search().select(["Name","Price"]).stringify()    
```

<h5>If you need any column in filter you must use it in select. With filter, use select after filter for fast search</h5>
```html
	self.Search().filter({Price:{value:200,condition:">"}}).select(["Name","Price"]).stringify()    
```

<p>
	Note : If you need any column in filter you must use it in select
</p>

<h4>Get Records with Max Value</h4>
<h5>Get records with MAX Rate</h5>
```html
	self.Search().max("Rate").stringify()    
```

<h5>Get only second record with MAX Rate. Although you can use start() and limit()</h5>
```html
	self.Search().max("Rate").index(2).stringify()    
```

<h4>Get Records with Min Value</h4>
<h5>Get records with Min Rate</h5>
```html
	self.Search().min("Rate").stringify()    
```

<h5>Get only second record with MIN Rate. Although you can use start() and limit()</h5>
```html
	self.Search().min("Rate").index(2).stringify()    
```

<h4>Sort Records</h4>
<h5>Sort Records with property, Pass true as second parameter if you want the results reversed</h5>
```html
	self.Search().order("Rate").stringify()    
	self.Search().order("Rate",true).stringify()    
```

<h5>Sort Records with multiple properties, Pass true as second parameter if you want the results reversed</h5>
```html
	self.Search().order("Rate").order('Id').stringify()    
	self.Search().order("Rate",true).order('Id',true).stringify()    
```

<h3>Applying Functions</h3>

<h4>Apply callback</h4>
<h5>userData() is the data you provided</h5>
```html
	self.Search().callback(function(){self.db().userData().push({Id:21,Rate:8,Price:400,Name:"Myths"})}).stringify()    
```

<h4>Apply Map Function</h4>
<h5>map() function will be applied on each object of data. Same like javascript map</h5>
```html
	self.Search().map(function(item){item.Action = true}).stringify()    
```

<h4>Apply multiple Functions</h4>
<h5>each() function will be applied on each object of data. Takes array of functions as parameter</h5>
```html
	var func = [
			function(item){return item.Action = item.Price > 200},
			function(item){item.Level = 'High'},
	]
	self.Search().each(func).stringify()    
```

<h4>Tempalte Functions</h4>
<h5>supplant() function will be applied on each object of data. Takes html template string</h5>
```html
	self.Search().supplant("<option id={Id} data-rate='{Rate}' data-price='{Price}'>{Name}</option>").stringify()
```

<h5>In each object a new property template will be added which will have html string</h5>
```html
	item.template = "<option id='1' data-rate='5' data-price='200'>History</option>"
```
